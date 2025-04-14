import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
} from '@mui/material';
import { injected } from '../connectors';
import SupplyChain from '../abi/SupplyChain.json';
// require("dotenv").config();


const PRODUCT_REVIEW_ADDRESS = "0xb879c6DDF2d45667d796Fe917398C31C79A64c8E"; // Thay thế bằng địa chỉ contract sau khi deploy
const PRODUCT_REVIEW_ABI = SupplyChain.abi; 

function ProductList() {
  const { active, account, activate } = useWeb3React();
  const [products, setProducts] = useState([]);
  const [openReview, setOpenReview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (active) {
      loadProducts();
    }
  }, [active]);

  const connect = async () => {
    try {
      await activate(injected);
    } catch (error) {
      setError('Lỗi kết nối ví: ' + error.message);
    }
  };

  const loadProducts = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        PRODUCT_REVIEW_ADDRESS,
        PRODUCT_REVIEW_ABI,
        provider
      );

      const productCount = await contract.productCount();
      const loadedProducts = [];

      for (let i = 1; i <= productCount; i++) {
        const product = await contract.getProduct(i);
        const reviews = await contract.getReviews(i);
        loadedProducts.push({
          id: i,
          ...product,
          reviews: reviews,
        });
      }

      setProducts(loadedProducts);
    } catch (error) {
      setError('Lỗi tải danh sách sản phẩm: ' + error.message);
    }
  };

  const handleReviewSubmit = async () => {
    if (!active) {
      setError('Vui lòng kết nối ví trước');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        PRODUCT_REVIEW_ADDRESS,
        PRODUCT_REVIEW_ABI,
        signer
      );

      // Tạo hash từ thông tin người đánh giá để đảm bảo ẩn danh
      const reviewerHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256'],
          [account, Date.now()]
        )
      );

      const tx = await contract.addReview(
        selectedProduct.id,
        rating,
        comment,
        reviewerHash
      );
      await tx.wait();

      setOpenReview(false);
      setRating(0);
      setComment('');
      loadProducts(); // Tải lại danh sách sản phẩm
    } catch (error) {
      setError('Lỗi thêm đánh giá: ' + error.message);
    }
  };

  return (
    <Box>
      {!active ? (
        <Button variant="contained" color="primary" onClick={connect}>
          Kết Nối Ví
        </Button>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} md={6} key={product.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.averageRating} readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({product.totalReviews} đánh giá)
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setSelectedProduct(product);
                      setOpenReview(true);
                    }}
                  >
                    Đánh Giá
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openReview} onClose={() => setOpenReview(false)}>
        <DialogTitle>Đánh Giá Sản Phẩm</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {selectedProduct?.name}
          </Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Nhận xét của bạn"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReview(false)}>Hủy</Button>
          <Button onClick={handleReviewSubmit} variant="contained" color="primary">
            Gửi Đánh Giá
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Paper sx={{ p: 2, mt: 2, bgcolor: 'error.light' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}
    </Box>
  );
}

export default ProductList; 