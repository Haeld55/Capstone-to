import { useState } from "react";

export default function ProductNaming({ isDeleteModalOpen: propIsDeleteModalOpen }) {
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [internalIsDeleteModalOpen, setInternalIsDeleteModalOpen] = useState(false);

  // ... (your existing code)

  console.log('isDeleteModalOpen:', propIsDeleteModalOpen);

  const handleDeleteConfirmationYes = async () => {
    await handleDeleteOrder(orderToDelete); // Perform deletion logic
    setInternalIsDeleteModalOpen(false); // Close the confirmation modal
  };

  const handleDeleteConfirmationNo = () => {
    setOrderToDelete(null);
    setInternalIsDeleteModalOpen(false); // Close the confirmation modal without deleting
  };

  return (
    internalIsDeleteModalOpen && (
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete this order?</p>
          <div className="flex items-center gap-2">
            <button onClick={handleDeleteConfirmationYes} className="btn btn-red">
              Yes
            </button>
            <button onClick={handleDeleteConfirmationNo} className="btn">
              No
            </button>
          </div>
        </div>
      </div>
    )
  );
}
