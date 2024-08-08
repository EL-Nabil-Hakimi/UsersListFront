import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'; // Heroicons v2

export default function User({ id, nom, prenom, email, age, tele, onEdit, onDelete }) {
  return (
    <tr>
      <td className="border border-gray-300 p-2">{id}</td>
      <td className="border border-gray-300 p-2">{nom}</td>
      <td className="border border-gray-300 p-2">{prenom}</td>
      <td className="border border-gray-300 p-2">{email}</td>
      <td className="border border-gray-300 p-2">{age}</td>
      <td className="border border-gray-300 p-2">{tele}</td>
      <td className="border border-gray-300 p-2 flex space-x-2">
        <button
          onClick={() => onEdit(id)}
          className="p-1 rounded hover:bg-blue-600 flex items-center justify-center"
        >
          <PencilSquareIcon className="h-6 w-6 text-blue-500 hover:text-white" />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-1 rounded hover:bg-red-600 flex items-center justify-center"
        >
          <TrashIcon className="h-6 w-6 text-red-500 hover:text-white" />
        </button>
      </td>
    </tr>
  );
}
