import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Switch,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { injected } from '../connectors';
import SupplyChain from '../abi/SupplyChain.json';
// require("dotenv").config();


const PRODUCT_REVIEW_ADDRESS = "0xb879c6DDF2d45667d796Fe917398C31C79A64c8E"; // Thay thế bằng địa chỉ contract sau khi deploy
const PRODUCT_REVIEW_ABI = SupplyChain.abi; // Thêm ABI của contract

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function AdminPanel() {
  const { active, account, activate } = useWeb3React();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openAddAdmin, setOpenAddAdmin] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newAdminAddress, setNewAdminAddress] = useState('');

  useEffect(() => {
    if (active) {
      loadData();
    }
  }, [active]);

  const connect = async () => {
    try {
      await activate(injected);
    } catch (error) {
      setError('Lỗi kết nối ví: ' + error.message);
    }
  };

  const loadData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        PRODUCT_REVIEW_ADDRESS,
        PRODUCT_REVIEW_ABI,
        provider
      );

      // Kiểm tra quyền admin
      const user = await contract.getUser(account);
      if (!user.isAdmin) {
        setError('Bạn không có quyền truy cập trang quản trị');
        return;
      }

      // Tải danh sách người dùng
      const userCount = await contract.userCount();
      const loadedUsers = [];
      for (let i = 1; i <= userCount; i++) {
        const userAddress = await contract.getUserByIndex(i);
        const userData = await contract.getUser(userAddress);
        loadedUsers.push({
          address: userAddress,
          ...userData,
        });
      }
      setUsers(loadedUsers);

      // Tải danh sách sản phẩm
      const productCount = await contract.productCount();
      const loadedProducts = [];
      for (let i = 1; i <= productCount; i++) {
        const product = await contract.getProduct(i);
        loadedProducts.push({
          id: i,
          ...product,
        });
      }
      setProducts(loadedProducts);
    } catch (error) {
      setError('Lỗi tải dữ liệu: ' + error.message);
    }
  };

  const handleUserStatusChange = async (userAddress, newStatus) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        PRODUCT_REVIEW_ADDRESS,
        PRODUCT_REVIEW_ABI,
        signer
      );

      const tx = await contract.setUserStatus(userAddress, newStatus);
      await tx.wait();
      setSuccess('Cập nhật trạng thái người dùng thành công');
      loadData();
    } catch (error) {
      setError('Lỗi cập nhật trạng thái người dùng: ' + error.message);
    }
  };

  const handleProductStatusChange = async (productId, newStatus) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        PRODUCT_REVIEW_ADDRESS,
        PRODUCT_REVIEW_ABI,
        signer
      );

      const tx = await contract.setProductStatus(productId, newStatus);
      await tx.wait();
      setSuccess('Cập nhật trạng thái sản phẩm thành công');
      loadData();
    } catch (error) {
      setError('Lỗi cập nhật trạng thái sản phẩm: ' + error.message);
    }
  };

  const handleAddAdmin = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        PRODUCT_REVIEW_ADDRESS,
        PRODUCT_REVIEW_ABI,
        signer
      );

      const tx = await contract.addAdmin(newAdminAddress);
      await tx.wait();
      setSuccess('Thêm admin thành công');
      setOpenAddAdmin(false);
      setNewAdminAddress('');
      loadData();
    } catch (error) {
      setError('Lỗi thêm admin: ' + error.message);
    }
  };

  const handleRemoveAdmin = async (userAddress) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        PRODUCT_REVIEW_ADDRESS,
        PRODUCT_REVIEW_ABI,
        signer
      );

      const tx = await contract.removeAdmin(userAddress);
      await tx.wait();
      setSuccess('Xóa quyền admin thành công');
      loadData();
    } catch (error) {
      setError('Lỗi xóa quyền admin: ' + error.message);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!active) {
    return (
      <Button variant="contained" color="primary" onClick={connect}>
        Kết Nối Ví
      </Button>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quản Trị Hệ Thống
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Quản Lý Người Dùng" />
        <Tab label="Quản Lý Sản Phẩm" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenAddAdmin(true)}
          >
            Thêm Admin Mới
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên người dùng</TableCell>
                <TableCell>Địa chỉ ví</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Quyền Admin</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.address}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt * 1000).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{user.isAdmin ? 'Có' : 'Không'}</TableCell>
                  <TableCell>{user.isActive ? 'Hoạt động' : 'Đã khóa'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Switch
                        checked={user.isActive}
                        onChange={(e) => handleUserStatusChange(user.address, e.target.checked)}
                      />
                      {user.isAdmin && user.address !== account && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleRemoveAdmin(user.address)}
                        >
                          Xóa Admin
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Nhà sản xuất</TableCell>
                <TableCell>Số đánh giá</TableCell>
                <TableCell>Điểm trung bình</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.manufacturer}</TableCell>
                  <TableCell>{product.totalReviews}</TableCell>
                  <TableCell>{product.averageRating}</TableCell>
                  <TableCell>{product.isActive ? 'Hoạt động' : 'Đã ẩn'}</TableCell>
                  <TableCell>
                    <Switch
                      checked={product.isActive}
                      onChange={(e) => handleProductStatusChange(product.id, e.target.checked)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <Dialog open={openAddAdmin} onClose={() => setOpenAddAdmin(false)}>
        <DialogTitle>Thêm Admin Mới</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Địa chỉ ví"
            value={newAdminAddress}
            onChange={(e) => setNewAdminAddress(e.target.value)}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddAdmin(false)}>Hủy</Button>
          <Button onClick={handleAddAdmin} variant="contained" color="primary">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default AdminPanel; 