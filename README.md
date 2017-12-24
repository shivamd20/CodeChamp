# hello-java-spark

This project consists of a basic Hasura project with a simple Java-Spark app running on it. Once this app is deployed on a Hasura cluster, you will have the app running at https://api.cluster-name.hasura-app.io

This is the right place to start if you are planning to build or want to learn to build an Java-Spark app with Hasura.

## Sections

* [Introduction](#introduction)
* [Quickstart](#quickstart)
* [Data API](#data-apis)
* [Auth API](#auth-apis)
* [Filestore API](#filestore-apis)
* [Custom microservice](#custom-microservice)
* [Migrate from an existing Java-Spark app](#migrate-from-an-existing-project)
* [Local development](#local-development)
* [FAQ](#faq)

## Introduction

This quickstart project comes with the following by default:
1. A basic Hasura project
2. Two tables `article` and `author` with some dummy data

## Quickstart

Follow this section to get this project working. Before you begin, ensure you have the latest version of [hasura cli tool](https://docs.hasura.io/0.15/manual/install-hasura-cli.html) installed.

### Step 1: Getting the project

```sh
$ hasura quickstart hello-java-spark
$ cd hello-java-spark
```

The above command does the following:
1. Creates a new folder in the current working directory called `hello-java-spark`
2. Creates a new free Hasura cluster for you and sets that cluster as the default cluster for this project
3. Initializes `hello-java-spark` as a git repository and adds the necessary git remotes.

### Step 2: Getting cluster information

Every Hasura project is run on a Hasura cluster. To get details about the cluster this project is running on:

```sh
$ hasura cluster status
```

This will give you your cluster status like so

```sh
INFO Status:
Cluster Name:       h34-excise98-stg
Cluster Alias:      hasura
Kube Context:       h34-excise98-stg
Platform Version:   v0.15.3
Cluster State:      Synced
```

Keep a note of your cluster name. Alternatively, you can also go to your [Hasura dashboard](https://dashboard.hasura.io) and see the clusters you have.

### Step 3: Deploying on a Hasura cluster

To deploy your app:

```sh
$ git add .
$ git commit -m "Initial Commit"
$ git push hasura master
```
When you push for the first time, it might take sometime. Next time onwards, it is really fast.

Once the above commands are executed successfully, head over to `https://api.cluster-name.hasura-app.io` (in this case `https://api.h34-excise98-stg.hasura-app.io`) to view your app.

### Api console

Every Hasura cluster comes with an api console that gives your a GUI to test out the baas features of Hasura. To open the api console

```sh
$ hasura api-console
```

## Data APIs

Hasura provides ready to use data apis to make powerful data queries on your tables. This means that you have ready-to-use JSON apis on any tables created. The url to be used to make these queries is always of the type: `https://data.cluster-name.hasura-app.io/v1/query` (in this case `https://data.h34-excise98-stg.hasura-app.io`)

As mentioned earlier, this quickstart app comes with two pre-created tables `author` and `article`.

**author**

column | type
--- | ---
id | integer NOT NULL *primary key*
name | text NOT NULL

**article**

column | type
--- | ---
id | serial NOT NULL *primary key*
title | text NOT NULL
content | text NOT NULL
rating | numeric NOT NULL
author_id | integer NOT NULL

Alternatively, you can also view the schema for these tables on the api console by heading over to the tab named `data` as shown in the screenshots below.

![alt text][data1]
![alt text][data2]

This means that you can now leverage the Hasura data queries to perform CRUD operations on these tables.

For eg, to fetch a list of all articles from the article table, you have to send the following JSON request to the data api endpoint -> `https://data.cluster-name.hasura-app.io/v1/query` (replace `cluster-name` with your cluster name)

```json
{
    "type": "select",
    "args": {
        "table": "article",
        "columns": [
            "id",
            "title",
            "content",
            "rating",
            "author_id"
        ]
    }
}
```

To learn more about the data apis, head over to our [docs](https://docs.hasura.io/0.15/manual/data/index.html)

## Auth APIs

Every app almost always requires some form of authentication. This is useful to identify a user and provide some sort of personalised experience to the user. Hasura provides various types of authentication (username/password, mobile/otp, email/password, Google, Facebook etc).

You can try out these in the `API EXPLORER` tab of the `api console`. To learn more, check out our [docs](https://docs.hasura.io/0.15/manual/users/index.html)

## Filestore APIs

Sometimes, you would want to upload some files to the cloud. This can range from a profile pic for your user or images for things listed on your app. You can securely add, remove, manage, update files such as pictures, videos, documents using Hasura filestore.

You can try out these in the `API EXPLORER` tab of the `api console`. To learn more, check out our [docs](https://docs.hasura.io/0.15/manual/users/index.html)

## Custom Microservice

There might be cases where you might want to perform some custom business logic on your apis. For example, sending an email/sms to a user on sign up or sending a push notification to the mobile device when some event happens. For this, you would want to create your own custom microservice which does these for you on the endpoints that you define.

This quickstart comes with one such custom microservice written in Java using the Spark framework. Check it out in action at `https://api.cluster-name.hasura-app.io` . Currently, it just returns a JSON response of "Hello World" at that endpoint.

In case you want to use another language/framework for your custom microservice. Take a look at our docs to see how you can add a new custom microservice.

## Migrate from an existing project

If you have an existing Java-Spark app and would like to migrate it to Hasura:

- Replace the `microservices/api/app` directory with your app directory.
- Ensure that the structure of the directory is coherent with the current structure.
- `git add . && git commit -m "Migration Commit"`
- `git push hasura master`

Now your existing app should be running on `https://api.cluster-name.hasura-app.io`

## Local development

Everytime you push, your code will get deployed on a public URL. However, for faster iteration you should locally test your changes.

### Testing your app locally

Follow these steps to test out your app locally

```sh
$ cd microservices/api/
$ docker build -t java-spark:<tag> .
$ docker run -d -p 8080:8080 java-spark:<tag>
```
Your app will be running on port 8080.

## Files and Directories

The project (a.k.a. project directory) has a particular directory structure and it has to be maintained strictly, else `hasura` cli would not work as expected. A representative project is shown below:

```
.
├── hasura.yaml
├── clusters.yaml
├── conf
│   ├── authorized-keys.yaml
│   ├── auth.yaml
│   ├── ci.yaml
│   ├── domains.yaml
│   ├── filestore.yaml
│   ├── gateway.yaml
│   ├── http-directives.conf
│   ├── notify.yaml
│   ├── postgres.yaml
│   ├── routes.yaml
│   └── session-store.yaml
├── migrations
│   ├── 1504788327_create_table_user.down.yaml
│   ├── 1504788327_create_table_user.down.sql
│   ├── 1504788327_create_table_user.up.yaml
│   └── 1504788327_create_table_user.up.sql
└── microservices
    └── api
        ├── app/
        ├── k8s.yaml
        └── Dockerfile
```

### `hasura.yaml`

This file contains some metadata about the project, namely a name, description and some keywords. Also contains `platformVersion` which says which Hasura platform version is compatible with this project.

### `clusters.yaml`

Info about the clusters added to this project can be found in this file. Each cluster is defined by it's name allotted by Hasura. While adding the cluster to the project you are prompted to give an alias, which is just hasura by default. The `kubeContext` mentions the name of kubernetes context used to access the cluster, which is also managed by hasura. The `config` key denotes the location of cluster's metadata on the cluster itself. This information is parsed and cluster's metadata is appended while conf is rendered. `data` key is for holding custom variables that you can define.

```yaml
- name: h34-ambitious93-stg
  alias: hasura
  kubeContext: h34-ambitious93-stg
  config:
    configmap: controller-conf
    namespace: hasura
  data: null
```
