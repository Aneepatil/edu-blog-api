# Edu-Blog API Application Project

## Tech Stack

__server:__Node.js, MongoDB,Mongoose, Express.js, JWT

# API FEATURES

- Authentication & Authorization
- Post CRUD operations
- Comment functionality
- System blocking user if inactive for 30 days
- Admin can block a user
- A user can block different users
- A user who block another user cannot see his/her posts
- Last date a post was created
- Check if a user is active or not
- Check last date a user was active
- Changing user award base on number of posts created by the user
- A user can follow and unfollow another user
- Get following and followers count
- Get total profile viewers count
- Get posts created count
- Get blocked counts
- Get all users who views someone's profile
- Admin can unblock a blocked user
- Update password
- Profile photo uploaded
- A user can close his/her accoun

# API-ENDPOINTS

- [API Authentication](API-Authentication)
   - [Register a new API client](Register-a-new-API-client)
   - [login](User-Login)
 
- [Users](https://www.github.com/octokatherine)
   - [Get my profile](Get-My-Profile)
   - [Get all users](Get-all-users)
   - [View a user profile Count](View-A-User-Profile)
   - [Following a user](Following-a-User)
   - [UnFollowing-a-user](Un-Following-a-User)
   - [Update user password](Update-user-password)
   - [Update your profile](Update-your-profile)
   - [Block another user](Block-another-user)
   - [Unblock another user](Unblock-another-user)
   - [Admin blocking a user](Admin-blocking-a-user)
   - [Admin Unblocking a user](Admin-Unblocking-a-user)
   - [Delete your account](Delete-your-account)
   - [Upload Profile Photo](Upload-Profile-Photo)

- [Posts](https://www.github.com/octokatherine)
  - [Create Post](https://www.github.com/octokatherine)
  - [Get All Posts](https://www.github.com/octokatherine)
  - [Get Single Post](https://www.github.com/octokatherine)
  - [Toggle Post like](https://www.github.com/octokatherine)
  - [Toggle Post dislike](https://www.github.com/octokatherine)
  - [Update Post](https://www.github.com/octokatherine)
  - [Delete Post](https://www.github.com/octokatherine)

- [Comments](https://www.github.com/octokatherine)
  - [Create comment](https://www.github.com/octokatherine)
  - [Update post](https://www.github.com/octokatherine)
  - [Delete post](https://www.github.com/octokatherine)

# API Authentication

Some endpoints may require authentication for example. To create a create/delete/update post, you need to register your API client and obtain an access token.
The endpoints that require authentication expect a bearer token sent in the `Authorization header`.

__Example:__

`Authorization: Bearer YOUR TOKEN`

# Register a new API client

```http
POST /api/v1/users/register
```
The request body needs to be in JSON format.

# API Reference

## User Login

```http
POST /api/v1/users/login
```
|Parameters|Type|Description|Required|
|:---------|:---|:----------|:-------|
|`authentication`|`string`|Your Token|No|
|`email`|`string`|Your Email|Yes|
|`password`|`string`|Your Password|Yes|

__Example:__

```javascript
{
  "email":"your email"
  "password":"your password"
}
```
## Get My Profile

```http
GET /api/v1/users/profile
```
|Parameters|Type|Description|Required|
|:---------|:---|:----------|:-------|
|`authentication`|`string`|Your Token|Yes|

## Get all users

```http
GET /api/v1/users
```
|Parameters|Type|Description|Required|
|:---------|:---|:----------|:-------|
|`authentication`|`string`|Your Token|no|

## View A User Profile

```http
GET /api/v1/users/profile-viewer/:id
```
|Parameters|Type|Description|Required|
|:---------|:---|:----------|:-------|
|`authentication`|`string`|Your Token|Yes|
|`id`|`string`|ID of the user you want to view his profile|Yes|


## Following a User

```http
GET /api/v1/users/following/:id
```
|Parameters|Type|Description|Required|
|:---------|:---|:----------|:-------|
|`authentication`|`string`|Your Token|Yes|
|`id`|`string`|	ID of the user you want to follow |Yes|


## Un-Following a User

```http
GET /api/v1/users/unfollowing/:id
```
|Parameters|Type|Description|Required|
|:---------|:---|:----------|:-------|
|`authentication`|`string`|Your Token|Yes|
|`id`|`string`|	ID of the user you want to unfollow |Yes|

## Update user password

```http
PUT /api/v1/users/update-password
```
|Parameters|Type|Description|Required|
|:---------|:---|:----------|:-------|
|`authentication`|`string`|Your Token|Yes|
|`password`|`string`|	Enter your password |Yes|

__Example request body:__

```javascript
{
  "password":"your password"
}
```

## Update your profile

```http
PUT /api/v1/users
```
|Parameters|Type|Description|Required|
|:---------|:---|:----------|:-------|
|`authentication`|`string`|Your Token|Yes|
|`email`|`string`|	Enter your password |No|
|`firstname`|`string`|	Enter your first name |No|
|`lastname`|`string`|	Enter your last name |No|

__Example request body:__

```javascript
{
  "email":"value",
  "firstname":"value",
  "lastname":"value",
}
```

## Block another user

```http
PUT /api/v1/users/block/:id
```
|Parameters|Type|Description|Required|
|:---------|:---|:----------|:-------|
|`authentication`|`string`|Your Token|Yes|
|`id`|`string`|	Id of the user you want to block |Yes|


## Unblock user

```http
PUT /api/v1/users/block/:id
```
|Parameters|Type|Description|Required|
|:---------|:---|:----------|:-------|
|`authentication`|`string`|Your Token|Yes|
|`id`|`string`|	Id of the user you want to unblock |Yes|

## Admin blocking a user

```http
PUT /api/v1/users/admin-block/:id
```
|Parameters|Type|Description|Required|
|:---------|:---|:----------|:-------|
|`authentication`|`string`|Your Token|Yes|
|`id`|`string`|	Id of the user he want to block |Yes|

## Admin unblocking a user

```http
PUT /api/v1/users/admin-unblock/:id
```
|Parameters|Type|Description|Required|
|:---------|:---|:----------|:-------|
|`authentication`|`string`|Your Token|Yes|
|`id`|`string`|	Id of the user he want to unblock |Yes|

## Delete your account
```http
  DELETE /api/v1/users/delete-account
```
|Parameters|Type|Description|Required|
|:---------|:---|:----------|:-------|
|`authentication`|`string`|Your Token|Yes|

## Upload Profile Photo

```http
POST api/v1/users/profile-photo-upload
```
|Parameters|Type|Description|Required|
|:---------|:---|:----------|:-------|
|`authentication`|`string`|Your Token|Yes|
|`profilePhoto`|`string`|	Image to upload |Yes|

## Posts API Refeference

