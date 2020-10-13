#!/bin/sh
set -e

# Run consul once before running it as a daemon to generate the ca certs used below
/usr/local/bin/consul-template -config "/etc/consul_template.d" -once

# Consul template renders config template and starts the application on sucess otherwise dies.
/usr/local/bin/consul-template  \
  -config "/etc/consul_template.d" \
  -exec "yarn ssr"