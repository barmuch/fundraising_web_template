# Flip Payment Gateway

-   Every request should be sent as application/x-www-form-urlencoded unless told differently. The body of the request must be sent as post data (e.g attribute=value&attribute2=value2&attribute3=value3).

-   422 status code is used to indicate the mistake from your side. The common response for this status code is like on the right side:

    ```json
    {
    "code": [outer_code],
    "errors": [
        {
        "attribute": "[attribute]",
        "code": [inner_code],
        "message": "[message]"
        }
    ]
    }
    ```

-   Possible value for outer_code is:

    -   BALANCE_INSUFFICIENT, happens when your Flip account balance is insufficient for the current transaction (balance < (transfer amount + transfer fee)).
    -   VALIDATION_ERROR, error related to the validation of your payload data.

-   Possible value for inner_code is all the code listed in respective products’ Error List section:

    -   Money Transfer error list
    -   Special Money Transfer error list
    -   Agent Money Transfer error list
    -   Agent Verification error list
    -   Accept Payment error list
    -   International Transfer error list

For more documentations visit https://docs.flip.id/?php#introduction
