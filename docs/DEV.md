# Development Setup

```bash
git clone git@github.com:interledgerjs/ilp-kit.git
cd ilp-kit
npm install
```

To run the ILP kit you will need to specify all of the required environment variables. `ilp-kit-cli` simplifies this by guiding you through the environment variables and creates an `env.list` which will be run automatically by the kit.

```bash
npm run configure
```

Build the vendor files (run this every time package dependencies change)
```bash
npm run build-dlls
```

Run a development server

Note: development server assumes you have `bunyan` installed globally.

```bash
npm run dev
```

## Hosts file

Edit your hosts file (`/private/etc/hosts` on OSX). Add these two lines

```
127.0.0.1   wallet1.com
127.0.0.1   wallet2.com
```

## Port forwarding (simple)

> NOTE: Current webfinger implementation will not work if the public ports 443 and 80 don't point to the development server.

``` sh
npm run dev-with-proxy
```

## Port forwarding (two ILP Kits)

If you would like to set up two ILP Kits on the same host, it's a good idea to use Apache for the virtual host handling.

> NOTE: This is an apache server config for developers. If you want to setup a production environment check out [this guide](https://github.com/interledgerjs/ilp-kit/blob/master/docs/SETUP.md).

In most cases it makes sense to expose the wallet through 443 (or 80) port, in which case you need to setup a port forwarding that will forward `API_PORT` requests to `API_PUBLIC_PORT` (443 or 80). Note that the port forwarding should work for both http(s) and websocket connections.

Here's an example of an Apache 2.4 virtual host with enabled port forwarding.

Make sure the following modules are enabled for all of these examples:

```
LoadModule xml2enc_module libexec/apache2/mod_xml2enc.so
LoadModule proxy_html_module libexec/apache2/mod_proxy_html.so
LoadModule proxy_module libexec/apache2/mod_proxy.so
LoadModule proxy_connect_module libexec/apache2/mod_proxy_connect.so
LoadModule proxy_http_module libexec/apache2/mod_proxy_http.so
LoadModule proxy_wstunnel_module libexec/apache2/mod_proxy_wstunnel.so
LoadModule proxy_ajp_module libexec/apache2/mod_proxy_ajp.so
LoadModule proxy_balancer_module libexec/apache2/mod_proxy_balancer.so
LoadModule ssl_module libexec/apache2/mod_ssl.so
LoadModule rewrite_module libexec/apache2/mod_rewrite.so
```

Make sure Apache is listening on port 80 and 443:
```
Listen 80
Listen 443
```

```
<VirtualHost *:443>
  ServerName wallet.com

  RewriteEngine On
  RewriteCond %{HTTP:Connection} Upgrade [NC]
  RewriteRule /(.*) ws://wallet.com:3000/$1 [P,L]

  ProxyRequests Off
  ProxyPass /ledger/websocket ws://localhost:3101/websocket

  ProxyPass / http://wallet.com:3000/ retry=0
  ProxyPassReverse / http://wallet.com:3000/

  SSLEngine on
  SSLCertificateFile /etc/apache2/ssl/wallet.com.crt
  SSLCertificateKeyFile /etc/apache2/ssl/wallet.com.key
</VirtualHost>
```

## Apache Virtual Hosts

> Note: The wallet instances are running on port 80, but we also need to setup virtual hosts on port 443 for the webfinger lookups (issue mentioned above).

```
<VirtualHost *:80>
  ServerName wallet1.com

  RewriteEngine On
  RewriteCond %{HTTP:Connection} Upgrade [NC]
  RewriteRule /(.*) ws://wallet1.com:3010/$1 [P,L]

  ProxyRequests Off
  ProxyPass /ledger/websocket ws://localhost:3101/websocket

  ProxyPass / http://wallet1.com:3010/ retry=0
  ProxyPassReverse / http://wallet1.com:3010/
</VirtualHost>

<VirtualHost *:443>
  ServerName wallet1.com
  ProxyPass / http://wallet1.com:3010/ retry=0
  ProxyPassReverse / http://wallet1.com:3010/
  RedirectMatch ^/$ https://wallet1.com

  ProxyRequests Off
  ProxyPass /ledger/websocket ws://localhost:3101/websocket

  SSLEngine on
  SSLCertificateFile /etc/apache2/ssl/wallet1.com.crt
  SSLCertificateKeyFile /etc/apache2/ssl/wallet1.com.key
</VirtualHost>

<VirtualHost *:80>
  ServerName wallet2.com

  RewriteEngine On
  RewriteCond %{HTTP:Connection} Upgrade [NC]
  RewriteRule /(.*) ws://wallet2.com:3020/$1 [P,L]

  ProxyRequests Off
  ProxyPass /ledger/websocket ws://localhost:3101/websocket

  ProxyPass / http://wallet2.com:3020/ retry=0
  ProxyPassReverse / http://wallet2.com:3020/
</VirtualHost>

<VirtualHost *:443>
  ServerName wallet2.com
  ProxyPass / http://wallet2.com:3020/ retry=0
  ProxyPassReverse / http://wallet2.com:3020/
  RedirectMatch ^/$ https://wallet2.com

  ProxyRequests Off
  ProxyPass /ledger/websocket ws://localhost:3101/websocket

  SSLEngine on
  SSLCertificateFile /etc/apache2/ssl/wallet2.com.crt
  SSLCertificateKeyFile /etc/apache2/ssl/wallet2.com.key
</VirtualHost>
```

> Note: You can use self signed certificates.

## Using Redux DevTools

In development, Redux Devtools are enabled by default. You can toggle visibility and move the dock around using the following keyboard shortcuts:

- <kbd>Ctrl+H</kbd> Toggle DevTools Dock
- <kbd>Ctrl+Q</kbd> Move Dock Position
- see [redux-devtools-dock-monitor](https://github.com/gaearon/redux-devtools-dock-monitor) for more detail information.
