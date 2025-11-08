---
layout:     post
title:      "免費搭建 OpenWebUI：Cloudflare Tunnel 零成本部署方案"
subtitle:   "Deploying OpenWebUI for Free with Cloudflare Tunnel"
date:       2025-11-08
author:     "Allen"
header-img: "https://img.allenspace.de/IMG_0325.8z6xy7a4vc.webp"
header-mask: 0.7
catalog: true
tags:
    - LLM
    - AI
    - OpenWebUI
    - Docker
    - Cloudflare
---

你想要擁有一個私人的 AI 對話平台，但不知道如何開始嗎？ 想要從任何地方訪問你的 AI 助手，但不懂複雜的網絡配置嗎？
那麼你可以使用 **Cloudflare Tunnel + DigitalPlat 免費域名** 零成本搭建一個完整的 OpenWebUI 實例，通過免費域名和 Cloudflare 的全球 CDN 實現安全訪問，無需開放任何服務器端口，也不需要設定公網 IP。

本文以AWS EC2部署 (也可以是任何的Linux主機，或使用個人電腦安裝Docker Desktop來部署)<br>部署方式可以是 Docker 命令、Docker Compose 或 Kubernetes，本文以 Docker 為例。

------

## 架構說明

```
用戶瀏覽器 → Cloudflare CDN → Cloudflare Tunnel 
         → EC2 Docker Container → OpenWebUI
```

**技術棧**：

- **前端訪問**：免費域名 + Cloudflare CDN
- **內網穿透**：Cloudflare Tunnel（內網穿透）
- **計算資源**：AWS EC2（Ubuntu/Debian）
- **容器化**：Docker 
- **應用**：OpenWebUI

------

## 第一階段：帳號準備與域名配置

### 1.1 註冊必要帳號

**需要註冊的帳號**：

1. **Cloudflare 帳號** - https://dash.cloudflare.com/sign-up
   - 用途：域名 DNS 託管、CDN、Tunnel 服務
2. **GitHub 帳號** - https://github.com/signup
   - 用於Digital Plate帳號註冊的KYC認證
3. **Digital Plate 帳號**
   - 用途：獲取免費域名，託管到Cloudflare
4. **AWS 帳號** - https://aws.amazon.com
   - 用途：部署 EC2 服務器
   - 可以用任何的Linux主機，或使用個人電腦安裝Docker Desktop來部署，本文以AWS舉例

### 1.2 申請並託管免費域名

**步驟**：

1. 在 Digital Plate 申請免費域名
2. 登入 Cloudflare 控制台
3. 點擊「添加站點」
4. 輸入你的域名
5. 選擇「Free」方案
6. 記錄 Cloudflare 提供的 Nameserver（通常是兩個）
7. 回到 Digital Plate，將 Nameserver 修改為 Cloudflare 提供的地址
8. 等待 DNS 生效（通常 5-30 分鐘）

**詳細教學請參考這部影片**：

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/K_cqWsHQaGI?si=k5PwCpEXtHLakG5b" frameborder="0" allowfullscreen></iframe>

------

## 第二階段：Cloudflare Tunnel 設定

### 2.1 創建 Cloudflare Tunnel

1. 登入 Cloudflare 控制台，左側菜單選擇「Zero Trust」

   ![](https://img.allenspace.de/Fasa-file-D0F064F6-7F10-48A9-A43B-A190B3FADFB1.5mo83k4pda.webp)

2. 在左側選單中點擊「Networks」，在彈出的下拉選單中選擇「Tunnels」

   ![](https://img.allenspace.de/Fasa-file-84C78FE3-C3C2-4034-BC76-1B521BA81477.7snmpbwd4a.webp)

   ![](https://img.allenspace.de/Fasa-file-1B43A570-82DF-4629-89E0-F17D4B85C519.77dz311wti.webp)

3. 在「Create a Tunnel」頁面中點擊「Create a Tunnel」

   ![](https://img.allenspace.de/Fasa-file-4E04CA11-8BF8-490F-ABCD-45A26E8A5BA8.2h8q4maag7.webp)

4. 選擇「Cloudflared」類型，點擊「Docker」

   ![](https://img.allenspace.de/Fasa-file-C20D435A-A1E7-496C-90ED-22127DD7DEB3.4ubclto3n0.webp)

5. 為 Tunnel 命名（例如：`test-openwebui`），點擊「Save Tunnel」

   ![](https://img.allenspace.de/Fasa-file-5DF2A935-B924-4B2B-ACAD-69F91BF082D6.pfr9pqxk9.webp)

6. 複製Docker命令（後續需要使用）

   ![](https://img.allenspace.de/Fasa-file-C20D435A-A1E7-496C-90ED-22127DD7DEB3.4ubclto3n0.webp)

### 2.2 暫時保留配置頁面

先不要關閉這個頁面，我們稍後會回來配置公共主機名。

------

## 第三階段:AWS EC2 實例部署

### 3.1 啟動 EC2 實例

1. 登入 AWS 控制台

2. 進入 EC2 服務

3. 點擊「Launch Instance」

   ![](https://img.allenspace.de/Fasa-file-16B6DBDB-3BAB-4B6F-AB6F-16EBF91FFE61.3uv98tgrk5.webp)

**實例配置建議**：

- **名稱**：`openwebui-server`
- **AMI**：Ubuntu 24.04 LTS 或 Debian 13
- **實例類型**：t3.small
- **密鑰對**：創建新密鑰或使用現有密鑰（用於 SSH 連接）
- 網絡設定
  - 允許 SSH（端口 22）從你的 IP
  - ⚠️ **不需要**開放 HTTP/HTTPS 端口（Tunnel 會處理）

**設定好各項參數後，點擊「Launch Instance」並等待啟動**

![](https://img.allenspace.de/Fasa-file-FED44DE5-0669-4709-88FB-DEB900F01C86.9kglkeb537.webp)

**儲存空間要設定大一點**

![](https://img.allenspace.de/Fasa-file-E95910BA-D82C-4E12-ADD8-8484EA36701B.3rbnb5075o.webp)

![](https://img.allenspace.de/Fasa-file-413AD995-2608-41ED-925C-CE36A5B50FCD.8hgw9ifb7s.webp)

### 3.2 連接到 EC2 實例

![](https://img.allenspace.de/Fasa-file-46887EE8-691D-4438-947A-880B0B7367EF.5fl08adz0p.webp)

------

## 第四階段：服務器環境配置

### 4.1 更新系統

```bash
# 更新套件列表
sudo apt update && sudo apt upgrade -y
```

### 4.2 安裝 Docker CE

**使用官方一鍵腳本**：

```bash
# 下載並執行 Docker 官方安裝腳本
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 將當前用戶加入 docker 群組（避免每次都用 sudo）
sudo usermod -aG docker $USER

# 登出後重新登入，或執行
newgrp docker

# 驗證安裝
docker --version
docker ps
```

**設置 Docker 開機自動啟動**：

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

------

## 第五階段：部署容器服務

### 5.1 安裝 Cloudflared（Tunnel 客戶端）

![](https://img.allenspace.de/Fasa-file-C20D435A-A1E7-496C-90ED-22127DD7DEB3.4ubclto3n0.webp)

複製**2.2中Cloudflare頁面中的docker指令**，應該會長這樣

```bash
docker run cloudflare/cloudflared:latest tunnel --no-autoupdate run --token <你的 TUNNEL_TOKEN>
```

複製指令中的TOKEN ，將下列指令中的<你的 TUNNEL_TOKEN>修改成複製的TOKEN，在終端中貼上

```bash
# 創建 Docker 網絡
docker network create cloudflare-tunnel

# 運行 cloudflared
docker run -d \
  --name cloudflared-tunnel \
  --restart unless-stopped \
  cloudflare/cloudflared:latest \
  tunnel --no-autoupdate run --token <你的 TUNNEL_TOKEN>
```

**驗證運行**：

```bash
# 查看容器日誌
docker logs cloudflared-tunnel

# 應該看到類似 "Connection registered" 的訊息
```

### 5.2 部署 OpenWebUI

```bash
# 運行 OpenWebUI 容器
docker run -d \
  --name openwebui \
  --network cloudflare-tunnel \
  -p 8080:8080 \
  -v open-webui:/app/backend/data \
  --restart unless-stopped \
  ghcr.io/open-webui/open-webui:main
```

**參數說明**：

- `-p 8080:8080`：映射端口（僅內網訪問，透過Cloudflare Tunnel內網穿透）
- `-v open-webui:/app/backend/data`：持久化數據存儲

**驗證運行**：

```bash
docker ps
# 應該看到兩個容器：cloudflared-tunnel 和 openwebui

# 檢查 OpenWebUI 日誌
docker logs openwebui
```

![](https://img.allenspace.de/Fasa-file-02F4CD1D-58A0-447D-9B88-70828BAD22D6.6pnxenkyqb.webp)

------

## 第六階段：配置 Cloudflare 公共主機名

### 6.1 添加公共主機名路由

1. 回到 Cloudflare Tunnel 配置頁面

2. 點擊你創建的 Tunnel

3. 選擇「Public Hostname」標籤

4. 點擊「Add a public hostname」

   ![](https://img.allenspace.de/Fasa-file-F1F8DC90-B44B-498A-9B14-DA2575AB4E6A.3goti04b0m.webp)

**配置詳情**：

- **Subdomain**：`openwebui`（或你喜歡的子域名）
- **Domain**：選擇你的域名（`yourname.example.com`）
- **Path**：留空
- **Service Type**：HTTP
- **URL**：`openwebui:8080`

> ⚠️ **重要說明**：
>
> - 如果兩個容器在同一 Docker 網絡，使用容器名稱 `openwebui:8080`
> - 如果使用Host網絡模式，使用 `127.0.0.1:8080`
> - `172.17.0.1` 是 Docker 默認Bridge網絡網關（Cloudflared默認的安裝命令是使用Bridge模式）

1. 點擊「Save hostname」

### 6.2 SSL/TLS 設置（可選）

1. 在 Cloudflare 域名控制台
2. 進入「SSL/TLS」設置
3. 選擇「Full」或「Full (strict)」模式
4. 啟用「Always Use HTTPS」

------

## 第七階段：訪問與測試

### 7.1 首次訪問

在瀏覽器輸入：

```
https://openwebui.yourname.example.com
```

**首次訪問會**：

1. 要求創建管理員帳號
2. 設置系統語言和偏好
3. 連接 AI 模型（如果配置了 API）

### 7.2 健康檢查

```bash
# 在 EC2 上測試本地訪問
curl http://localhost:8080

# 檢查 Tunnel 連接狀態
docker logs cloudflared-tunnel | grep "registered"
```

------

## 故障排除

### 問題 1：無法訪問域名

**檢查清單**：

```bash
# 1. 驗證 DNS 解析
dig openwebui.yourname.example.com

# 2. 檢查 Tunnel 連接
docker logs cloudflared-tunnel

# 3. 檢查 OpenWebUI 運行狀態
docker logs openwebui

# 4. 測試容器間網絡
docker exec cloudflared-tunnel ping openwebui
```

### 問題 2：502 Bad Gateway

**可能原因**：

- OpenWebUI 容器未正常運行
- Tunnel 配置的 URL 錯誤
- 容器間網絡不通

**解決方案**：

```bash
# 重啟容器
docker restart openwebui
docker restart cloudflared-tunnel

# 檢查容器網絡
docker network inspect cloudflare-tunnel
```

### 問題 3：Cloudflared Token 錯誤

**重新獲取 Token**：

1. 刪除舊 Tunnel（如需要）
2. 創建新 Tunnel
3. 複製新 Token
4. 更新容器配置

------

## 連接 AI 模型

[參考這篇文章](https://blog.jiatool.com/posts/openwebui_install/#%E4%B8%B2%E6%8E%A5-llm-%E6%A8%A1%E5%9E%8B)

------

## 參考資源

- [Cloudflare Tunnel 官方文檔](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [OpenWebUI 官方文檔](https://docs.openwebui.com/)
- [Docker 官方文檔](https://docs.docker.com/)
- [AWS EC2 使用指南](https://docs.aws.amazon.com/ec2/)
