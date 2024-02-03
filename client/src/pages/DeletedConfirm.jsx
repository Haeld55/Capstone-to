
export default function DeletedConfirm({ onDelete, onCancel }) {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg">
            <p className="text-lg font-semibold mb-4">Are you sure you want to delete this order?</p>
            <div className="flex justify-end">
              <button
                onClick={onDelete}
                className="bg-red-500 text-white py-2 px-4 mr-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={onCancel}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
    );
}
