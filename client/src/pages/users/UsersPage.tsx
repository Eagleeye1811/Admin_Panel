import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import UserModal from '../../components/users/UserModal';
import { getUsers, createUser, updateUserStatus, deleteUser } from '../../services/userService';
import { User } from '../../types/api.types';

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = async (data: Partial<User>) => {
    try {
      if (selectedUser) {
        // Update user logic (e.g., update user status or email)
        await updateUserStatus(selectedUser._id, data.isActive ?? selectedUser.isActive);
      } else {
        // Create new user
        await createUser(data);
      }
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Users Management</h1>
        <Button onClick={() => {
          setSelectedUser(null);
          setShowModal(true);
        }}>
          <FaUserPlus className="me-2" /> Add New User
        </Button>
      </div>

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>
                <Badge bg={user.isActive ? 'success' : 'danger'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowModal(true);
                  }}
                >
                  <FaEdit className="me-1" /> Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(user._id)}
                >
                  <FaTrash className="me-1" /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <UserModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleAddEdit}
        user={selectedUser}
      />
    </Container>
  );
};

export default UsersPage;