import {  useState } from 'react';
import { Plus, Search,  Sun, Moon, Zap,LogOut } from 'lucide-react';

const Sidebar = () => {
    const [search, setSearch] = useState('')
    const conversations = [
  {
    _id: "1",
    name: "Aman",
    lastMessage: "Hello bro"
  },
  {
    _id: "2",
    name: "Rahul",
    lastMessage: "How are you?"
  },
  {
    _id: "3",
    name: "Priya",
    lastMessage: "Good morning"
  }
];
const filteredConversations = conversations.filter((conversation) =>
  conversation.name.toLowerCase().includes(search.toLowerCase())
);
  return (
    <>
        <div className='w-80 flex flex-col border-r bg-white shrink-0'>
             {/* Header */}
            <div className='p-4 border-4 border-gray-200'>
                <div className='flex items-center  justify-between mb-4'>
                    <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center'>
                            <Zap className='w-4 h-4 text-white'/>
                        </div>
                        <span className='font-display font-bold  text-lg'>Chatify</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <button className='btn-ghost p-2' title='Toggle Theme'>
                            <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
                        </button>
                        <button className='btn-ghost p-2' title='New conversation'>
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                {/* Search */}
                <div className='relative'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5'/>
                    <input 
                        type="text"
                        placeholder='Search Conversation'
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                        className='input-field pl-9 py-2 text-sm'
                    />
                </div>
            </div>
            {/* Conversation List */}
    <div>
    {filteredConversations.map((conversation) => (
     <div
          key={conversation._id}
          className="p-4 border-b hover:bg-gray-100 cursor-pointer"
    >
      <h3 className="font-medium">
        {conversation.name}
      </h3>

      <p className="text-sm text-gray-500">
        {conversation.lastMessage}
      </p>
    </div>
))}
    </div>
        </div>
    </>
  )
}

export default Sidebar