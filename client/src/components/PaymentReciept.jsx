
export default function PaymentReciept({ imageUrl, altText, closeModal}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="max-w-3xl p-4 bg-white">
        <button
          className="absolute top-0 right-0 m-4 text-2xl font-bold text-white cursor-pointer"
          onClick={closeModal}
        >
          X
        </button>
        <img src={imageUrl} alt={altText} className="w-full" />
      </div>
    </div>
  )
}
