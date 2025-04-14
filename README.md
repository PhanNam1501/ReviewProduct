# Hệ Thống Đánh Giá Sản Phẩm Blockchain

Hệ thống đánh giá sản phẩm mới sử dụng blockchain, cho phép các nhà sản xuất lấy đánh giá từ người dùng về sản phẩm mà không yêu cầu chia sẻ thông tin cá nhân.

## Tính Năng

- Thêm sản phẩm mới
- Đánh giá sản phẩm với điểm số và nhận xét
- Tính ẩn danh cho người đánh giá
- Hiển thị điểm đánh giá trung bình và số lượng đánh giá
- Giao diện người dùng thân thiện

## Yêu Cầu Hệ Thống

- Node.js (v14 trở lên)
- MetaMask hoặc ví Web3 khác
- Truffle hoặc Hardhat (để deploy smart contract)

## Cài Đặt

1. Clone repository:
```bash
git clone <repository-url>
cd product-review-blockchain
```

2. Cài đặt dependencies cho smart contract:
```bash
cd contracts
npm install
```

3. Cài đặt dependencies cho frontend:
```bash
cd ../frontend
npm install
```

4. Deploy smart contract:
```bash
cd ../contracts
truffle migrate --network <network-name>
```

5. Cập nhật địa chỉ contract trong frontend:
- Mở file `frontend/src/components/AddProduct.js`
- Mở file `frontend/src/components/ProductList.js`
- Thay thế `YOUR_CONTRACT_ADDRESS` bằng địa chỉ contract đã deploy
- Thêm ABI của contract vào biến `PRODUCT_REVIEW_ABI`

6. Khởi chạy frontend:
```bash
cd ../frontend
npm start
```

## Sử Dụng

1. Kết nối ví MetaMask hoặc ví Web3 khác
2. Thêm sản phẩm mới bằng cách điền tên và mô tả
3. Xem danh sách sản phẩm và đánh giá
4. Đánh giá sản phẩm bằng cách chọn điểm số và viết nhận xét

## Bảo Mật

- Thông tin người đánh giá được mã hóa bằng hash
- Chỉ nhà sản xuất mới có thể thêm sản phẩm mới
- Tất cả các giao dịch được ghi lại trên blockchain

## Đóng Góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request để đóng góp vào dự án.

## Giấy Phép

MIT License 