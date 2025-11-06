# Netlify 環境變數完整設定清單

> 📅 更新日期：2025-11-06  
> 🎯 目的：重新設定所有環境變數
> ⚠️ 請按照此清單逐一設定，總共 **17 個變數**

---

## 📋 設定方式

**Netlify Dashboard → Site settings → Environment variables → Add a variable**

每個變數都選擇：**Scopes = All scopes**

---

## 🔥 Firebase 前端變數（6 個）

### 1. VITE_FIREBASE_API_KEY
```
Key: VITE_FIREBASE_API_KEY
Value: AIzaSyCGUUoiZQGbHLd8KIUI_222UHRzTQA4Gyfl
```

### 2. VITE_FIREBASE_AUTH_DOMAIN
```
Key: VITE_FIREBASE_AUTH_DOMAIN
Value: run2025-7734c.firebaseapp.com
```

### 3. VITE_FIREBASE_PROJECT_ID
```
Key: VITE_FIREBASE_PROJECT_ID
Value: run2025-7734c
```

### 4. VITE_FIREBASE_STORAGE_BUCKET
```
Key: VITE_FIREBASE_STORAGE_BUCKET
Value: run2025-7734c.appspot.com
```

### 5. VITE_FIREBASE_MESSAGING_SENDER_ID
```
Key: VITE_FIREBASE_MESSAGING_SENDER_ID
Value: 104417306883
```

### 6. VITE_FIREBASE_APP_ID
```
Key: VITE_FIREBASE_APP_ID
Value: 1:104417306883:web:e9a58ab406a280addd8136
```

---

## 🔥 Firebase 後端變數（3 個）

### 7. FIREBASE_PROJECT_ID
```
Key: FIREBASE_PROJECT_ID
Value: run2025-7734c
```

### 8. FIREBASE_CLIENT_EMAIL
```
Key: FIREBASE_CLIENT_EMAIL
Value: firebase-adminsdk-fbsvc@run2025-7734c.iam.gserviceaccount.com
```

### 9. FIREBASE_PRIVATE_KEY
```
Key: FIREBASE_PRIVATE_KEY
Value: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2D92lFk/+rLex\nZX2UPo/Hrqm0BmoYety7ZnupMpTiMu2tMdBMuUQuUt0UiyYUoz4mtAVvWxe0/Dje\njjpUxLMzmbgSsW0NDCIjcJyj0nb9TAGryv8yVw/hr4FQoBERXeZch8/L+1yX9WpS\ngbExXCf+rWg09BKfEeVqbSZBcil8l/o5tzH22VKpr3qwkG5t7A4l72KiCzsNrLbZ\n9cIuSphI39CC8lyRz6Y9x1L6L0EEIX+CLeo9GE1VHqCJ66LXCPwostrGfYj5Dyrs\nYZYt5TB16tZjnNL5LyXVuWbWFkxKxECga9DFpRFCSdqxUpHzlvU6MLS78eXBrKna\nNba54/7rAgMBAAECggEAAewCnyVa/H7D76j5HZFYK4z3TfxgBAMkBQxsvhlXw1gz\nScfurCir2hYA2csq6z6FP5ut5QI1VVvw7mnaSXPMH9LTGSDAscm7gIabTgrA5nqg\nwo4Bif1WSxUdtzABY3QLearrXCVlUatYZHzpqxzkb9v9GiCrePy+Nb885KWjtM98\nrKLKab8DL62rd1qhIFaFBQmFVJ8c2Nkj7x8seHk/4gWVcm40WEwxJyNfWeGWWsj5\nOWBKzLj7cVglqHLRCF0aRwq7CQQfxADPfcvfQYDrt/V4NgUMy4uSVsDIvPUqOXtX\n/vxFCqmJBaudMFGOBFXWifO8FCtbTHSLm8zilmLhqQKBgQDivyGRn3LpnEdG038j\nJMj71iErE2xPL45Q9/8z87WtSivGQZGn8RbRZO9oYT6Kg5RGSwM/ohsruM01kd1T\nzXLUjsc9WcgRWB4Iq89WudoStkBjGaex74qBvzCRex1eLL7n4cIrZwDfEggzsEun\n+Xq38bo37x/qshijtmafbMqd0wKBgQDNjOn5sLp+gVd/Zx2S9eM7bQXk3TY20D9J\nuZb93LKDCgBmwgfrZEUXdC9+k+fuDdgHMYxpuJw+yLBEsnAQzjVHD+VLvc9jef+w\nvIVHBfSV3k8NKgnLxZtPStkx9W9F0nKTZXLPRSR3jhIYAwij1ccOLoVmknDb/HS7\nkvGrNpmziQKBgQDOf+ytd34qvNW47gJaWjTkDWYVmdHI5/F/UevMP4ZUdDkbjDl/\nrjPurTLPZ8iSUzSlM8mYmSSPk/TndZkQqgmLBSD0gaCQEyT/FqF0RTwSUIKg/gtY\nJGSKtzkfNPVRAAU4nsS7zEnh3cU0dbjhGHansPC74f26O0nvRr19MZHxWwKBgCBq\nK2+r1g0jGohF250UV6xEahyIYgdM2d4nfU81YZVWm2+ZA6S0YEztjpvYeUfKORoR\nT0JQ0Zr5DQsYVKHh0vcM460JFs5qK89UO3RS1RpZP4Ak8/yFghOECzJcsRqCsHzc\nD7nt/m04I1RUDiXADa8H2ROu3ktiyYnXB3Nnnd95AoGBANTdO7W7AORPkcEd1RrC\nMjbjX5zZKpTuZv02MYaDp40LxSzMTPPJsuVHNznQRZrdITajufn6alUtBEgKinfa\nq+MIcUIoPIQVeOPLekp2rIBWQBSyZNmVyr1PVzgEaAEl6HWoPVQ/Q6IZ3owGoDfC\nHmNWR7Ow19pxiPiCesXo5Fui\n-----END PRIVATE KEY-----\n"
```

⚠️ **重要**：這個 Key 很長，請完整複製上面的內容（包含外層引號）

---

## 🔐 LINE Login 變數（4 個）

### 10. VITE_LINE_CHANNEL_ID
```
Key: VITE_LINE_CHANNEL_ID
Value: 2008428213
```

### 11. VITE_LINE_CALLBACK_URL
```
Key: VITE_LINE_CALLBACK_URL
Value: https://banqiaorun2025.netlify.app/auth/callback
```

### 12. LINE_CHANNEL_ID
```
Key: LINE_CHANNEL_ID
Value: 2008428213
```

### 13. LINE_CHANNEL_SECRET
```
Key: LINE_CHANNEL_SECRET
Value: c9e0f79dcb97d076096fb9bd89412b27
```

---

## 📱 LINE Messaging API 變數（4 個 - 新功能）

### 14. LINE_MESSAGING_CHANNEL_ACCESS_TOKEN
```
Key: LINE_MESSAGING_CHANNEL_ACCESS_TOKEN
Value: 85Vr/88pWX8trE5gXauAXqkBIfHCwmi48ydDlOBjqwYCdECSUZZnUzb7Tt8LJUW1vhMaF7crbSXn1Ld0kdu9Vi7/vcoQxF9kr5uY3+XnTHcSpoB1QEHanwnf7AQUE/tT8ol0Fcf8pdsBnofLHHpy5AdB04t89/1O/w1cDnyilFU=
```

### 15. LINE_MESSAGING_CHANNEL_SECRET
```
Key: LINE_MESSAGING_CHANNEL_SECRET
Value: a3aa83ddb7def561d684ee3f2aa7f11e
```

### 16. LINE_MESSAGING_CHANNEL_ID
```
Key: LINE_MESSAGING_CHANNEL_ID
Value: 2008432643
```

### 17. LINE_GROUP_ID ⭐ 新取得
```
Key: LINE_GROUP_ID
Value: C7305cb0973f52bbb8a62c4c8a41a80db
```

---

## ⚙️ 其他設定（選填）

### SECRETS_SCAN_ENABLED（可選）
```
Key: SECRETS_SCAN_ENABLED
Value: false
```
用途：關閉 Netlify 的敏感資訊掃描

---

## ✅ 設定檢查清單

請逐一確認：

### Firebase 變數（9 個）
- [ ] VITE_FIREBASE_API_KEY
- [ ] VITE_FIREBASE_AUTH_DOMAIN
- [ ] VITE_FIREBASE_PROJECT_ID
- [ ] VITE_FIREBASE_STORAGE_BUCKET
- [ ] VITE_FIREBASE_MESSAGING_SENDER_ID
- [ ] VITE_FIREBASE_APP_ID
- [ ] FIREBASE_PROJECT_ID
- [ ] FIREBASE_CLIENT_EMAIL
- [ ] FIREBASE_PRIVATE_KEY

### LINE Login 變數（4 個）
- [ ] VITE_LINE_CHANNEL_ID
- [ ] VITE_LINE_CALLBACK_URL
- [ ] LINE_CHANNEL_ID
- [ ] LINE_CHANNEL_SECRET

### LINE Messaging 變數（4 個）
- [ ] LINE_MESSAGING_CHANNEL_ACCESS_TOKEN
- [ ] LINE_MESSAGING_CHANNEL_SECRET
- [ ] LINE_MESSAGING_CHANNEL_ID
- [ ] LINE_GROUP_ID

### 其他（1 個，可選）
- [ ] SECRETS_SCAN_ENABLED

**總計：17-18 個環境變數**

---

## ✅ 所有值都已完整

所有 17 個環境變數的值都已經在上面列出，您可以直接複製貼上！

不需要再從舊設定複製任何東西 👍

---

## 🚀 設定完成後

1. **儲存所有變數**
2. **點擊「Trigger deploy」重新部署**
3. **等待部署完成**（約 1-2 分鐘）
4. **測試網站功能是否正常**

---

## 🧪 測試項目

部署完成後，請測試：

### 1. 基本功能
- [ ] 網站可以正常開啟
- [ ] 可以註冊/登入（Email）
- [ ] 可以 LINE 登入

### 2. 活動功能
- [ ] 可以建立活動
- [ ] 可以瀏覽活動
- [ ] 可以報名活動

### 3. LINE 通知功能（新）
- [ ] 建立活動後，LINE 群組收到通知
- [ ] 通知內容正確

---

## 📞 如有問題

如果設定後網站無法運作：

1. **檢查環境變數是否全部設定**
2. **檢查 FIREBASE_PRIVATE_KEY 格式是否正確**
3. **查看 Netlify Deploy Logs 確認錯誤訊息**
4. **確認已重新部署**

---

**準備好了嗎？開始設定環境變數！** 🚀

設定過程中如有任何問題隨時問我！

