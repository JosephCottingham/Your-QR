# General

Sometimes you need an easy way for users to access an endpoint. The best way to do this in a fast paced environment is with QR codes. However, you don’t want to rely on a third party service that may go down and affect your entire business. This project provides a deployable API to handle these requirements for you. You can also use the publicly available service.

## Overview

The general purpose of this API is to create QR codes for a given URI. You may use the publicly avaiable service or deploy it your self.


http://www.URL_HERE.com/API/v1/

## Deployment

```bash
TODO docker deployment
```


## Auth

Create an account at http://www.URL_HERE.com/create or via the API.
Using this account you will be able to create and remove API tokens from your account. Currently, for free use, the maximum requests is 10 per day.


## Creating an QR code

```bash
curl --header 'Content-Type: application/json' \
    --header 'qr-token: <YOUR TOKEN HERE>' \
    --request POST \
    --data '{
        "uri":"<YOUR URL HERE>",
        "error_correction_level":"<YOUR ERROR CORRECTION HERE>",
        "image_width":int(PX),
        "light_color":"<YOUR LIGHT COLOR HERE>",
        "dark_color":"<YOUR DARK COLOR HERE>",
        "multimedia_type":"<YOUR MULTIMEDIA TYPE HERE>",
    }' \
    http://www.URL_HERE.com/api/v1/codes
# RETURNS STATUS CODE 200
# QR REFRENCE CODE
```

## Getting an QR code

```bash
curl --header 'qr-token: <YOUR TOKEN HERE>' \
    --request GET \
    http://www.URL_HERE.com/api/v1/codes
# RETURNS STATUS CODE 200
# LIST OF ALL USER QR CODES SAVED ON SERVER
```

```bash
curl --header 'qr-token: <YOUR TOKEN HERE>' \
    --request GET \
    http://www.URL_HERE.com/api/v1/codes/<YOUR_QR_CODE>
# RETURNS 200 ON SUCCESS
# FILE OF MULTIMEDIA TYPE SAVED WITH OBJECT
```

## Deleting an QR code

```bash
curl --header 'qr-token: <YOUR TOKEN HERE>' \
    --request DELETE \
    http://www.URL_HERE.com/api/v1/codes/<YOUR_QR_CODE>
# RETURNS 200 ON SUCCESS
```

## Patching an QR code

```bash
curl --header 'Content-Type: application/json' \
    --header 'qr-token: <YOUR TOKEN HERE>' \
    --request PATCH \
    --data '{
        "uri":"<YOUR URL HERE>",
        "error_correction_level":"<YOUR ERROR CORRECTION HERE>",
        "image_width":int,
        "light_color":"<YOUR LIGHT COLOR HERE>",
        "dark_color":"<YOUR DARK COLOR HERE>",
        "multimedia_type":"<YOUR MULTIMEDIA TYPE HERE>",
    }' \
    http://www.URL_HERE.com/api/v1/codes
# RETURNS 200 ON SUCCESS
# QR REFRENCE CODE
```
