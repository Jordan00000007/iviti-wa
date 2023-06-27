![COVER](./assets/images/iVIT-I-Logo-B.png)

# iVIT-I-Web-Application
The AI solution provdie by innodisk.
This project need to go with backend API as following:
https://github.com/MaxChangInnodisk/ivit-i-web-api-fast

# Outline
- [iVIT-I-Web-Application](#ivit-i-web-application)
- [Requirements](#requirements)
- [Quick Start](#quick-start)


# Requirements
* [Docker 20.10 + ](https://docs.docker.com/engine/install/ubuntu/)
* [Docker-Compose v2.15.1 ](https://docs.docker.com/compose/install/linux/#install-using-the-repository)
    * you can check via `docker compose version`
* [NodeJS v18.14.2 ](https://nodejs.org/en/blog/release/v18.14.2)


# Quick Start
* Download Repository

    ```
    git clone -b v1.0.3 https://github.com/Jordan00000007/iviti-wa && cd iviti-wa
    ```

* Install Dependency

    ```
    npm install
    ```

* Set up docker and container

    ```
    sudo docker-compose -f docker-compose-pro.yml up -d
    ```
* The web site running on port 80 with URL as bellowing

    http://127.0.0.1/

# Q & A
* How to change port?

    1. Modify nginx.conf file, find the server section and modify the listen port which you want to change.
    ```
    server {
        listen 8001;
        listen [::]:8001;
    ```
    
    2. Use docker-compose rebuild the image.

    ```
    sudo docker-compose -f docker-compose-pro.yml up -d
    ```