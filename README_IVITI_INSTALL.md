# 網站安裝說明:



### Step 0-1 : 準備工作,要確認一下npm與nodejs的版本號

npm : version 9.5.0
nodejs : version 10.19.0

### Step 0-2 : 準備工作,由於build command會用到匯入參數的command env-cmd,要先安裝一下
```
    npm install env-cmd -g
```

### Step 1 : 將專案打包到build資料夾
```
    npm run build
```

### Step 2 : 使用docker-compose將專案設成docker container
```
    sudo docker-compose -f docker-compose-pro.yml up -d
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