# Local Development Configuration for URLs

In local development, you may encounter issues with URLs that use IP addresses or have incorrect formats. This README provides guidance on how to configure your local environment to handle these URLs correctly.

## Using Local Hostnames

1. **Open the Hosts File**:

    - On Windows, open the hosts file at `C:\Windows\System32\drivers\etc\hosts`.
    - On macOS and Linux, open the hosts file at `/etc/hosts`.

2. **Map Hostnames**:

    - Add entries to map hostnames to your local IP address. For example:
        ```
        127.0.0.1       localhost
        127.0.0.1       mylocalapp.com
        ```

3. **Save the Hosts File**.

## Update URLs in Configuration

4. **Replace Problematic URLs**:
    - In your application or merchant settings, replace URLs with the local hostnames you defined in the hosts file. For example:
        - Replace `https://localhost:3000/payment/notification` with `https://mylocalapp.com:3000/payment/notification`.

## Use Self-Signed SSL Certificates

5. If using HTTPS for local development:
    - Generate a self-signed SSL certificate or use tools like `mkcert` to create one.
    - Configure your local development server to use this certificate.

## Test Locally

6. Start your local development server and access your application using the local hostnames and configured port.
    - For example, open `https://mylocalapp.com:3000` in your web browser.

By following these steps, you can ensure that your local development environment handles URLs correctly. This allows you to test and develop your application locally with the same URL structure as in a production environment.
