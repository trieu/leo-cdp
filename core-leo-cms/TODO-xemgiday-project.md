# TODO for xemgiday.com

## Server
* ssh -i .ssh/ec2-virginia-ssh.pem  ubuntu@3.82.203.48

## SEO & Template Engine
* Meta Tags for public app UI: https://gist.github.com/kevinSuttle/1997924

## Backend
* Admin CMS: Ajax Loading when save Page, Post
* Keyword data mining 
* Topic generator
* Chatbot https://aboullaite.me/my-first-java-bot/

## Content Crawler
* Text Summary https://towardsdatascience.com/text-summarization-in-python-76c0a41f0dc4
* https://github.com/MojoJolo/textteaser
 
## Concept  
* Data Mining hot keywords, clustering into trending topic, Topic Ranking
* Classify links into 24 categories https://support.aerserv.com/hc/en-us/articles/207148516-List-of-IAB-Categories
* Crawling title, description, text and video (YouTube, Facebook)
* Ranking by Social Trends and Seach Trends 
* Unique features: best videos for knowledge and entertament from YouTube, Facebook and Vimeo

## Product Mission
* 100,000 visitors / day
* Success Case Study 

## Data Source
* https://www.humanbrainfacts.org/hypothalamus.php
* Tech https://www.youtube.com/channel/UCn1XnDWhsLS5URXTi5wtFTA/videos
* News https://www.youtube.com/channel/UCPWqNpeq_QX0vdSlRj60rqw/videos
* News https://www.youtube.com/channel/UCRjzfa1E0gA50lvDQipbDMg/videos
* News https://www.youtube.com/channel/UCIg56SgvoZF8Qg0Jx_gh6Pg/videos
* News http://vnews.gov.vn/tin-trong-nuoc
* https://www.typetalk.com/blog/10-proven-ways-get-focused-stay-focused/
* Socialolgy https://www.youtube.com/channel/UCnUl4-oOxarjwmIl_oxxmlA


server {
        listen 80;
        listen [::]:80;
        listen 443 ssl http2;
        listen [::]:443 ssl http2;

        server_name xemgiday.com www.xemgiday.com;

        ssl_certificate      /usr/local/etc/nginx/ssl/xemgiday_fullchain.pem;
        ssl_certificate_key  /usr/local/etc/nginx/ssl/xemgiday_privkey.pem;

        location / {
             proxy_pass http://localhost:9190/;
             #proxy_pass http://localhost:3000/;
             #proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
             proxy_set_header X-Forwarded-Port $server_port;
             proxy_set_header Host            $host;
             proxy_set_header X-Forwarded-For $remote_addr;
        }
}