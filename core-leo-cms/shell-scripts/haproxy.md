```
frontend localnodes
    bind *:80
    reqadd X-Forwarded-Proto:\ http

    # Add CORS headers when Origin header is present
    capture request header origin len 128
    http-response add-header Access-Control-Allow-Origin %[capture.req.hdr(0)] if { capture.req.hdr(0) -m found }
    rspadd Access-Control-Allow-Methods:\ GET,\ HEAD,\ OPTIONS,\ POST,\ PUT  if { capture.req.hdr(0) -m found }
    rspadd Access-Control-Allow-Credentials:\ true  if { capture.req.hdr(0) -m found }
    rspadd Access-Control-Allow-Headers:\ Origin,\ Accept,\ X-Requested-With,\ Content-Type,\ Access-Control-Request-Method,\ Access-Control-Request-Headers,\ Authorization  if { capture.req.hdr(0) -m found }

    default_backend backend_apps

frontend localnodes-https
    # Certificate
    bind *:443 ssl crt /etc/ssl/private/domain_com.pem
    reqadd X-Forwarded-Proto:\ https

    # Add CORS headers when Origin header is present
    capture request header origin len 128
    http-response add-header Access-Control-Allow-Origin %[capture.req.hdr(0)] if { capture.req.hdr(0) -m found }
    rspadd Access-Control-Allow-Methods:\ GET,\ HEAD,\ OPTIONS,\ POST,\ PUT  if { capture.req.hdr(0) -m found }
    rspadd Access-Control-Allow-Credentials:\ true  if { capture.req.hdr(0) -m found }
    rspadd Access-Control-Allow-Headers:\ Origin,\ Accept,\ X-Requested-With,\ Content-Type,\ Access-Control-Request-Method,\ Access-Control-Request-Headers,\ Authorization  if { capture.req.hdr(0) -m found }

    default_backend backend_apps
        
backend backend_apps
    # Force HTTPS
    http-request set-header X-Forwarded-Port %[dst_port]
    http-request add-header X-Forwarded-Proto https if { ssl_fc }
    redirect scheme https if !{ ssl_fc }
    server App1 192.168.1.201:80 check
    server App2 192.168.1.202:80 check
    server App3 192.168.1.203:80 check
    server App4 192.168.1.204:80 check
    server App5 192.168.1.205:80 check
```