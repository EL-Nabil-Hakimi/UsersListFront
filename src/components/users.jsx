import React, { useState, useEffect } from 'react';
import User from './User';
import Modal from './Modal'; 
import EditModal from './EditModal'; 
import DeleteModal from './DeleteModal'; 
import { PlusIcon } from '@heroicons/react/24/outline'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterAge, setFilterAge] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers(filterQuery, filterAge);
  }, [currentPage, filterQuery, filterAge]);

  const fetchUsers = async (searchQuery = '', ageQuery = '') => {
    try {
      const response = await fetch(`https://userlist.elhakimi.com/api/users?page=${currentPage}&search=${searchQuery}&age=${ageQuery}`);
      const contentType = response.headers.get('Content-Type');
  
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Expected JSON but received:', text);
        return;
      }
  
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
        setTotalPages(data.last_page || 1);
      } else {
        console.error('Failed to fetch users, status:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filterUsers = () => {
    const query = filterQuery.toLowerCase();
    const ageQuery = filterAge.toLowerCase();

    const filtered = users.filter(user =>
      (user.nom && user.nom.toLowerCase().includes(query)) ||
      (user.prenom && user.prenom.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.tele && user.tele.toLowerCase().includes(query)) ||
      (user.age && user.age.toString().toLowerCase().includes(ageQuery))
    );

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    filterUsers();
  }, [users, filterQuery, filterAge]);

  const handleAddUser = async (user) => {
    try {
      const response = await fetch('https://userlist.elhakimi.com/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        fetchUsers(filterQuery, filterAge);
        setIsAddModalOpen(false);
        toast.success('User added successfully!');
      } else {
        console.error('Failed to add user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (editedUser) => {
    try {
      const response = await fetch(`https://userlist.elhakimi.com/api/users/${editedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        fetchUsers(filterQuery, filterAge);
        setIsEditModalOpen(false);
        setCurrentUser(null);
        toast.success('User updated successfully!');
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = (user) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`https://userlist.elhakimi.com/api/users/${currentUser.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchUsers(filterQuery, filterAge);
        setIsDeleteModalOpen(false);
        setCurrentUser(null);
        toast.success('User deleted successfully!');
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center p-4 pt-10 bg-gray-100" id='myTable'>
      <ToastContainer />
      <h1 className="text-3xl font-semibold mb-6 text-white">Liste des utilisateurs</h1>

      <div className="w-full max-w-5xl mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Rechercher... (Nom, Prenom, Email, Téléphone)"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="w-[70%] p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Age..."
          value={filterAge}
          onChange={(e) => setFilterAge(e.target.value)}
          className="w-[29%] p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="border border-gray-300 p-3">Id</th>
              <th className="border border-gray-300 p-3">Nom</th>
              <th className="border border-gray-300 p-3">Prenom</th>
              <th className="border border-gray-300 p-3">Email</th>
              <th className="border border-gray-300 p-3">Age</th>
              <th className="border border-gray-300 p-3">Tele</th>
              <th className="border border-gray-300 p-3">Options</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <User
                key={user.id}
                id={user.id}
                nom={user.nom}
                prenom={user.prenom}
                email={user.email}
                age={user.age}
                tele={user.tele}
                onEdit={() => handleEdit(user)}
                onDelete={() => handleDelete(user)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="mx-2 text-white">Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-500 text-white rounded-md ml-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-20 right-20 w-16 h-16 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors duration-300"
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddUser}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={currentUser || {}}
        onSave={handleEditSave}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}


