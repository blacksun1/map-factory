import * as nodeunit from "nodeunit";
import * as interfaces from "../lib/interfaces";
// tslint:disable-next-line no-var-requires
const createMapper = require("../lib/index");

const exampleGroup: nodeunit.ITestGroup = {

  "Map a source field to the same object structure": function (test: nodeunit.Test): void {

    const expected = {
      "fieldName": "name1",
      "fieldId": "123"
    };

    // Start example

    const source = {
      "fieldName": "name1",
      "fieldId": "123",
      "fieldDescription": "description"
    };

    const map = createMapper();

    map("fieldName");
    map("fieldId");

    const result = map.execute(source);

    // End example

    test.deepEqual(result, expected);

    return test.done();
  },

  "Map a source field to a different object structure": function (test: nodeunit.Test): void {

    const expected = {
      "field": {
        "name": "name1",
        "id": "123"
      }
    };

    // Start example

    const source = {
      "fieldName": "name1",
      "fieldId": "123",
      "fieldDescription": "description"
    };

    const map = createMapper();

    map("fieldName").to("field.name");
    map("fieldId").to("field.id");

    const result = map.execute(source);

    // End example

    test.deepEqual(result, expected);

    return test.done();
  },

  "Supports deep references for source and target objects": function (test: nodeunit.Test): void {

    const expected = {
      user:
      {
        login: "john@someplace.com",
        accountId: "abc123",
        entitlements: ["game-1", "game-2"]
      }
    };

    // Start example

    const source = {
      "person": {
        "name": "John",
        "email": "john@someplace.com",
        "phone": "(712) 123 4567"
      },
      "account": {
        "id": "abc123",
        "entitlements": [{
          "id": 1,
          "name": "game-1"
        },
          {
            "id": 2,
            "name": "game-2"
          }]
      }
    };

    const map = createMapper();

    map("person.email").to("user.login");
    map("account.id").to("user.accountId");
    map("account.entitlements.[].name").to("user.entitlements");

    const result = map.execute(source);

    // End example

    test.deepEqual(result, expected);

    return test.done();
  },

  "You can also reference specific items in an array": function (test: nodeunit.Test): void {

    const expected = {
      "topStory": {
        "id": 1,
        "title": "Top Article",
        "author": "Joe Doe",
        "body": "..."
      }
    };

    // Start example

    const source = {
      "articles": [
        {
          "id": 1,
          "title": "Top Article",
          "author": "Joe Doe",
          "body": "..."
        },
        {
          "id": 2,
          "title": "Second Article",
          "author": "Joe Doe",
          "body": "..."
        }
      ]
    };

    const map = createMapper();

    map("articles.[0]").to("topStory");

    const result = map.execute(source);

    // End example

    test.deepEqual(result, expected);

    return test.done();
  },

  "More complicated transformations can be handled by providing a function": function (test: nodeunit.Test): void {

    const expected = {
      "topStory": {
        "id": 1,
        "title": "Top Article",
        "author": "Joe Doe",
        "body": "..."
      },
      "otherStories": [
        {
          "id": 2,
          "title": "Second Article",
          "author": "Joe Doe",
          "body": "..."
        }
      ]
    };

    // Start example

    const source = {
      "articles": [
        {
          "id": 1,
          "title": "Top Article",
          "author": "Joe Doe",
          "body": "..."
        },
        {
          "id": 2,
          "title": "Second Article",
          "author": "Joe Doe",
          "body": "..."
        }
      ]
    };

    const map = createMapper();

    map("articles.[0]").to("topStory");
    map("articles").to("otherStories", articles => {

      // We don't want to include the top story
      articles.shift();

      return articles;

    });

    const result = map.execute(source);

    // End example

    test.deepEqual(result, expected);

    return test.done();
  },

  "An existing object can be provided as the target object": function (test: nodeunit.Test): void {

    const expected = {
      "field": {
        "name": "name1",
        "id": "123"
      },
      "existing": "data"
    };

    // Start example

    const source = {
      "fieldName": "name1",
      "fieldId": "123",
      "fieldDescription": "description"
    };

    const destination = {
      "existing": "data"
    };

    const map = createMapper();

    map("fieldName").to("field.name");
    map("fieldId").to("field.id");

    const result = map.execute(source, destination);

    // End example

    test.deepEqual(result, expected);

    return test.done();
  },

  "Select from multiple sources at once": function (test: nodeunit.Test): void {

    const expected = {
      "fruit": {
        "count": 7
      }
    };

    // Start example

    const source = {
      "apples": {
        "count": 3
      },
      "oranges": {
        "count": 4
      }
    };

    const map = createMapper();

    map(["apples.count", "oranges.count"]).to("fruit.count", (appleCount, orangeCount) => {

      return appleCount + orangeCount;

    });

    const result = map.execute(source);

    // End example

    test.deepEqual(result, expected);

    return test.done();
  },
  "create a single transform mapping object which is used to map all of your data together": function (test: nodeunit.Test) {

    const expected = {
      "blog": {
        "post": {
          "text": "<p>Some Text</p>",
          "comments": ["not too bad", "pretty good", "awful"],
          "topComment": "not too bad"
        },
        "author": {
          "id": 123,
          "name": "John Doe",
          "email": "john.doe@nobody.com"
        }
      }
    };

    // Start example

    // assume the following inputs
    const post = {
      "body": "<p>Some Text</p>"
    };

    const comments = {
      "list": ["not too bad", "pretty good", "awful"]
    };

    const user = {
      "id": 123,
      "name": "John Doe",
      "email": "john.doe@nobody.com"
    };

    // combine multiple objects into a single source object
    const source = { post, comments, user };

    const map = createMapper();

    map("post.body").to("blog.post.text");
    map("comments.list").to("blog.post.comments");
    map("comments.list[0]").to("blog.post.topComment");
    map("user.id").to("blog.author.id");
    map("user.name").to("blog.author.name");
    map("user.email").to("blog.author.email");

    const final = map.execute(source);

    // End example

    test.deepEqual(final, expected);
    test.done();

  },
  "Or use multiple mappers and chain them together": function (test: nodeunit.Test) {


    const expected = {
      "blog": {
        "post": {
          "text": "<p>Some Text</p>",
          "comments": ["not too bad", "pretty good", "awful"],
          "topComment": "not too bad"
        },
        "author": {
          "id": 123,
          "name": "John Doe",
          "email": "john.doe@nobody.com"
        }
      }
    };

    // Start Example

    // assume the following inputs
    const post = {
      "body": "<p>Some Text</p>"
    };

    const comments = {
      "list": ["not too bad", "pretty good", "awful"]
    };

    const user = {
      "id": 123,
      "name": "John Doe",
      "email": "john.doe@nobody.com"
    };

    const postMapper = createMapper();
    const commentMapper = createMapper();
    const authorMapper = createMapper();

    postMapper
      .map("body").to("blog.post.text");

    commentMapper
      .map("list").to("blog.post.comments")
      .map("list[0]").to("blog.post.topComment");

    authorMapper
      .map("id").to("blog.author.id")
      .map("name").to("blog.author.name")
      .map("email").to("blog.author.email");

    let result = postMapper.execute(post);
    result = commentMapper.execute(comments, result);
    result = authorMapper.execute(user, result);

    // End example

    test.deepEqual(result, expected);
    test.done();
  },

  "Class example": function (test: nodeunit.Test) {

    interface IBlogRepos {
      getPost(id: string): Promise<any>;
    }

    interface IUserRepos {
      getUser(id: string): Promise<any>;
    }

    interface IBlogService {
      getPost1(id: string): Promise<any>;
      getPost2(id: string): Promise<any>;
    }

    class MockBlogRepos implements IBlogRepos {

      public getPost(id: string): Promise<any> {

        return new Promise(function(resolve) {

          return resolve({
            _id: id,
            title: "My Blog Post",
            body: "Bacon ipsum dolor amet salami",
            authorId: "blacksun1"
          });
        });
      }
    }

    class MockUserRepos implements IUserRepos {

      public getUser(id: string): Promise<any> {

        return new Promise(function(resolve) {

          return resolve({
            _id: id,
            name: "Foobo Babbins",
            email: "foobo@theshire.co.uk"
          });
        });
      }
    }

    class BlogService implements IBlogService {

      private _blogRepos: IBlogRepos;
      private _userRepos: IUserRepos;
      private _blogMapper: interfaces.IMapping;
      private _authorMapper: interfaces.IMapping;
      private _blogAuthorMapper: interfaces.IMapping;

      constructor(blogRepos: IBlogRepos, userRepos: IUserRepos) {

        this._blogRepos = blogRepos;
        this._userRepos = userRepos;

        // initialise mappers
        this._blogMapper = createMapper()
          .map("_id").to("blog.id")
          .map("title").to("blog.title")
          .map("body").to("blog.body");

        this._authorMapper = createMapper()
          .map("_id").to("blog.author.id")
          .map("name").to("blog.author.name")
          .map("email").to("blog.author.email");

        this._blogAuthorMapper = createMapper()
          .map("blog._id").to("blog.id")
          .map("blog.title")
          .map("blog.body")
          .map("author._id").to("blog.author.id")
          .map("author.name").to("blog.author.name")
          .map("author.email").to("blog.author.email");
      }

      private decorateBlogPostWithAuthor(userId: string, post: any): Promise<any> {

        return this._userRepos.getUser(userId)
          .then(user => this._authorMapper.execute(user, post));
      }

      public getPost1(id) {

        return this._blogRepos.getPost(id)
          .then(post => {
            const mappedPost = this._blogMapper.execute(post);
            return this.decorateBlogPostWithAuthor(post.authorId, mappedPost);
          });
      }

      public getPost2(id) {

        const data: any = {};
        return this._blogRepos.getPost(id)
          .then(post => data.blog = post)
          .then(post => this._userRepos.getUser(post.authorId))
          .then(author => data.author = author)
          .then(() => this._blogAuthorMapper.execute(data));
      }
    }

    const blogRepos = new MockBlogRepos();
    const userRepos = new MockUserRepos();
    const sut = new BlogService(blogRepos, userRepos);

    const testPostId = "foobar-1";

    // Act
    const actual = [
      sut.getPost1(testPostId),
      sut.getPost2(testPostId)
    ];

    // Assert
    const assertion = post => {
      test.deepEqual(post, {
        blog: {
          id: testPostId,
          title: "My Blog Post",
          body: "Bacon ipsum dolor amet salami",
          author: {
            id: "blacksun1",
            name: "Foobo Babbins",
            email: "foobo@theshire.co.uk"
          }
        }
      });
    };

    return actual[0]
      .then(assertion)
      .then(() => actual[1])
      .then(assertion)
      .catch(error => {
        throw error;
      })
      .then(() => test.done());
  }

};

exports.examples = exampleGroup;
