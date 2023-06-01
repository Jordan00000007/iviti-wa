# 網站安裝說明:

### Step 1 : 將專案打包到build資料夾
```
    npm run build
```

### Step 2 : 使用docker-compose將專案設成docker container
```
    sudo docker-compose -f docker-compose-pro.yml
```

### 問題記錄
1. 執行npm run build時失敗,查詢log,發現node version是10.19.0,但我用的是18.14.2
原來sudo user用的版本跟一般user不一樣,使用下面command切換su的node路徑

```
$which node
/usr/local/bin/node
$sudo su
$which node
/usr/bin/node
$export PATH=$PATH:/usr/local/bin
$node -v
v7.2.0
```
結果改路徑也沒用,不要用sudo build就可以了
sudo npm run build 改成npm run build