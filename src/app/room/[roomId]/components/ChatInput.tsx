"use client";
export default function ChatInput() {
  return (
    <div className="flex gap-2 p-2 w-full">
      <input
        type="text"
        placeholder="輸入訊息..."
        className="flex-1 bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none"
      />
      <button className="px-4 py-2 bg-blue-600 rounded-md text-sm hover:bg-blue-500">
        送出
      </button>
    </div>
  );
}
