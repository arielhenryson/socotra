# Socotra

## Socotra is a Web Framework for building isomorphic scalable, high-performance Web Applications
[![Known Vulnerabilities](https://snyk.io/test/github/arielhenryson/socotra/badge.svg)](https://snyk.io/test/github/arielhenryson/socotra)
[![Build Status](https://travis-ci.org/arielhenryson/socotra.svg?branch=master)](https://travis-ci.org/arielhenryson/socotra)

Build web apps using TypeScript Node.JS Express Angular 2 and MongoDB.

The project is still in its early stages and under heavy development

## Installation

Download the files to your computer
```bash
$ git clone https://github.com/arielhenryson/Socotra
```
Move to download directory
```bash
$ cd Socotra
```
Install dependencies:
```bash
$ npm install
```

Before running your server make sure MongoDB is up and running

To compile your code to javascript and run
```bash
$ npm start
```


##Philosophy
Socotra attempts to make your code modular as much as possible, reusable and easy to change and scale.
We use the same language in the server-side and in the client-side and we provide a way to use the generic code 
which you can use for both sides of your app. We give you a well-defined structure in order to easily extend your code
base and to understand it. We use TypeScript to catch errors in compile time instead of in runtime to enable you to spend
less time writing tests for your app. We do a variety of things under the hood  to automate the process of creating your app.
We give you out of the box support for SEO and UI creation.


## Introduction
Building web apps include Dealing with many many parts (client side, server side, database, 
3rd party API and more). It gets more complicated as your code grows, you get more users
and you need to scale your app to support more traffic. Socotra bundles together stuff that will help you 
to build scalable web apps fast. In order to narrow the gap between your client side and your server side,
Socotra uses only one language, TypeScript, so you can reuse code that you develop for your client side
in the server side and vice versa. When you develop with Socotra your app will be stateless,
all of the data is saved in a MongoDB database, even sessions data and uploaded files. So when the time to handle more 
traffic will come, you will not need to change anything in your code, you will simply change your app to talk to a MongoDB
cluster and then you will be able to add as many machines as you need. You may think that storing session data in a database
is not a good idea, but you will be surprised to know that MongoDB can serve this data from RAM very quickly. Socotra uses
Angular 2, so your app will be act as a single page application, users will have very fast UI (the app doesn't need to go back to
the server to load views after the first load). Socotra also uses Angular Universal for server side rendering so every app
entry point is first rendered on the server.  This can be vary important for SEO purposes. 