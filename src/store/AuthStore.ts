import prisma from '@/lib/prisma';
import { email } from './../../node_modules/zod/src/v4/core/regexes';
import { Logout } from "@/components/actions/LogoutAction";
import { createClient } from "@/utils/superbase/client";
import { User } from '@supabase/supabase-js';
import { create } from "zustand";



interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  loading:boolean
  errroMsg:string | null
  authState:()=>void
  setloading:(data:boolean)=>void
  sucesss:boolean, 
  error:string | null
  
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, 
  loading:false,
  sucesss:false,
  error:null, 

  errroMsg: null,


  setUser: (user) => set({ user:user }),
  setloading:(loading)=>set({loading:loading}),



  authState: async ()=>{
    set({loading:true})
    const  supabase  =  await createClient();
    const {data,  error} =  await  supabase.auth.getUser()
    

    if(error){
       set({loading:false,  sucesss:false,  user:null, errroMsg:"failed", error:error?.message})
       
    }
     set({loading:false,  sucesss:true,  user:data.user})
    
  },

  logout: async () => {
    set({loading:true})

    const supabase = await createClient()
    const {error} =  await supabase.auth.signOut()

    if(error){
        set({loading:false, errroMsg:"Sorry couldn't log you  out  please try again! "})
    }
    set({loading:false,  user:null, sucesss:true})

  }
}));
