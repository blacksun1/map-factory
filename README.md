# map-factory

[![Coverage Status](https://coveralls.io/repos/github/midknight41/map-factory/badge.svg?branch=master)](https://coveralls.io/github/midknight41/map-factory?branch=master) [![Build](https://api.travis-ci.org/midknight41/map-factory.svg?branch=master)](https://travis-ci.org/midknight41/map-factory) [![Deps](https://david-dm.org/midknight41/map-factory.svg)](https://david-dm.org/midknight41/map-factory#info=dependencies) [![devDependency Status](https://david-dm.org/midknight41/map-factory/dev-status.svg)](https://david-dm.org/midknight41/map-factory#info=devDependencies)

[![NPM](https://nodei.co/npm/map-factory.png?downloads=true)](https://www.npmjs.com/package/map-factory/)

A simple utility that greatly simplifies mapping data from one shape to another. **map-factory** provides a fluent interface and supports deep references, custom transformations, and object merging.

This is an alternative interface for the excellent [object-mapper](http://www.npmjs.com/object-mapper).

See [Change Log](./CHANGELOG.md) for changes from previous versions.

## Usage

**map-factory** supports two similar interfaces. Which you use is up to you and your use case.

The first is a fluent interface:

```js
const createMapper = require("map-factory");

const mapper = createMapper();

mapper
  .map("sourceField").to("source.field")
  .map("sourceId").to("source.id");

const result = map.execute(source);
```

Alternatively you can you the slightly shorter version:

```js
const createMapper = require("map-factory");

const map = createMapper();

map("sourceField").to("source.field");
map("sourceId").to("source.id");

const result = map.execute(source);
```

There is no functional difference between the two and they can be used interchangeably.

## Map a source field to the same object structure

Mapping is explicit so unmapped fields are discarded.

```js
const createMapper = require("map-factory");

const source = {
  "fieldName": "name1",
  "fieldId": "123",
  "fieldDescription": "description"
};

const map = createMapper();

map("fieldName");
map("fieldId");

const result = map.execute(source);
console.log(result);

/*
  {
    "fieldName": "name1",
    "fieldId": "123"
  }
*/
```

## Map a source field to a different object structure

Of course, we probably want a different structure for our target object.

```js
const createMapper = require("map-factory");

const source = {
  "fieldName": "name1",
  "fieldId": "123",
  "fieldDescription": "description"
};

const map = createMapper();

map("fieldName").to("field.name");
map("fieldId").to("field.id");

const result = map.execute(source);
console.log(result);

/*
  {
    "field": {
      "name": "name1",
      "id": "123"
    }
  }
*/
```

## Supports deep references for source and target objects

```js
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
console.log(result);

/*
  {
    "user": {
      "login": "john@someplace.com",
      "accountId": "abc123",
      "entitlements": ["game-1", "game-2"]
    }
  }
*/
```

You can also reference specific items in an array.

```js
const createMapper = require("map-factory");

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
console.log(result);

/*
{
  "topStory": {
    "id": 1,
    "title": "Top Article",
    "author": "Joe Doe",
    "body": "..."
  }
}
*/
```

More complicated transformations can be handled by providing a function.

```js
const createMapper = require("map-factory");

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
console.log(result);

/*
  {
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
  }
*/
```

An existing object can be provided as the target object.

```js
const createMapper = require("map-factory");

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
console.log(result);

/*
  {
    "existing": "data",
    "field": {
        "name": "name1",
        "id": "123"
    }
  }
*/

```

## Select from multiple sources at once

You can also provide an array of source fields and they can be extracted together if you provide a transform for the target field.

```js
const createMapper = require("map-factory");

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
console.log(result);

/*
  {
    fruit: {
    count: 7
    }
  }
*/

```

## Common patterns

### Dealing with multiple sources of data

There are two ways to deal with multiple sources of data.
- Combine your data in to a single object before mapping
- Use multiple mappers and combine the objects as you go

#### Combine data first
This method is useful when you are retrieving all of your data at once. It involves taking your source data and appending it all onto a single object.

The advantage of this method is that you can create a single transform mapping object which is used to map all of your data together and that you do not have to mutate your objects.

We'd recommend this approach for most use cases.

```js
const createMapper = require("map-factory");

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
console.log(final);

/*
  {
    "blog":
    {
      "post":
      {
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
  }
*/
```

#### Merge objects with multiple mappers
The other option is to decorate your existing data objects in a piece by piece fashion using the merge ability. Note that when using a named mapper like ```postMapper``` the code reads better when you use the explicit ```map()``` method.

```js
const createMapper = require("map-factory");

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
```

The above approach appears untidy when compared with combining the data into a single object but it is useful in situations where your mapping logic is distributed.
For example, a mapper used within a class may build its map in the constructor and execute the mapper in a method.

```js

class BlogService {

  constructor(blogRepos) {
    this.blogRepos = blogRepos;

    // initialise mapper
    this.authorMapper = createMapper();
    this.authorMapper.map("id").to("blog.author.id");
    this.authorMapper.map("name").to("blog.author.name");
    this.authorMapper.map("email").to("blog.author.email");

  }

  // Here post is created somewhere else and we are extending it with user information
  decorateBlogPostWithAuthor(userId, post) {
    return this.blogRepos.getUser(userId)
      .then(user => this.authorMapper.execute(user, post));
  }

}
```
