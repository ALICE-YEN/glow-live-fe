"use client";

export default function ChatBox() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 flex-shrink-0">
      <div className="h-24 overflow-y-auto bg-gray-800 rounded-md p-2 mb-2">
        <div className="text-sm text-gray-300">觀眾 A：這主播不錯耶</div>
        <div className="text-sm text-gray-300">觀眾 B：+1</div>
        <div className="text-sm text-gray-300">觀眾 C：我送了一個 🎁</div>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="輸入訊息..."
          className="flex-1 bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none"
        />
        <button className="px-4 py-2 bg-blue-600 rounded-md text-sm hover:bg-blue-500">
          送出
        </button>
      </div>
    </div>
  );
}
