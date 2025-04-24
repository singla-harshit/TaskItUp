import { apiSlice } from "../apiSlice";
const TASK_URL='/task'
export const postApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getDashboardStats:builder.query({
            query:()=>({
                url:`${TASK_URL}/dashboard`,
                method:"GET",
                credentials:"include"
            })
        }),
        getAllTask: builder.query({
            query: ({ strQuery, isTrashed, search }) => ({
              url: `${TASK_URL}?stage=${strQuery}&isTrashed=${isTrashed}&search=${search}`,
              method: "GET",
              credentials: "include",
            }),
          }),
          createTask: builder.mutation({
            query: (data) => ({
              url: `${TASK_URL}/create`,
              method: "POST",
              body: data,
              credentials: "include",
            }),
          }),
      
          duplicateTask: builder.mutation({
            query: (id) => ({
              url: `${TASK_URL}/duplicate/${id}`,
              method: "POST",
              body: {},
              credentials: "include",
            }),
          }),
      
          updateTask: builder.mutation({
            query: (data) => ({
              url: `${TASK_URL}/update/${data._id}`,
              method: "PUT",
              body: data,
              credentials: "include",
            }),
          }),
    })
})
export const {useGetDashboardStatsQuery,useGetAllTaskQuery,useUpdateTaskMutation,useCreateTaskMutation,useDuplicateTaskMutation}=postApiSlice