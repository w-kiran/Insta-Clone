import { Link } from 'react-router-dom'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'

const CommentDialog = ({open, setOpen}) => {
  const[text,setText]= useState("")
  return (
    <div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={()=> setOpen(false)} className="max-w-5xl p-0 flex flex-col">
          <div className='flex flex-1'>
            <div className='w-1/2'>
              <img
                className='rounded-lg w-full aspect-square object-cover'
                src="https://images.unsplash.com/photo-1587614222490-3497ae026130?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MnwxMDQ3MTI3NXx8ZW58MHx8fHx8"
                alt="post_img"
            />
            </div>
         
        <div className='w-1/2 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex gap-3 items-center'>
                <Link>
                  <Avatar>
                    <AvatarImage src=''/>
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className='font-semibold text-xs'>Username</Link>
                  {/* <span className='text-gray-600 text-sm'>Bio here...</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer' />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                    Unfollow
                  </div>
                  <div className='cursor-pointer w-full'>
                    Add to favorites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
              Comments
              Comments
              Comments
              Comments
              Comments
              Comments
              Comments
              Comments
            </div>
            <div className='p-4'>
              <div className='flex items-center gap-2'>
                <input type="text" placeholder='Add a comment...' className='w-full outline-none border text-sm border-gray-300 p-2 rounded' />
                <Button variant="outline">Send</Button>
              </div>
            </div>
          </div>
        </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CommentDialog
