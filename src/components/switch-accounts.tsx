// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { RootState } from "@/store";
// import { setAccountNumber } from "@/store/slices/accountsSlice";
// import { useSelector, useDispatch } from "react-redux";

// interface SelectAccountProps {
//   label?: string;
//   items: { value: string; label: string }[];
//   placeholder?: string;
//   onChange?: (value: string) => void;
// }

// export function SelectAccount({
//   items,
//   placeholder = "Switch Accounts",
//   onChange,
// }: SelectAccountProps) {
//   const dispatch = useDispatch();
//   const selectedAccount = useSelector(
//     (state: RootState) => state.current_account.accountNumber
//   );

//   const handleChange = (value: string) => {
//     dispatch(setAccountNumber(value));
//     if (onChange) onChange(value);
//   };

//   return (
//     <Select onValueChange={handleChange} value={selectedAccount || ""}>
//       <SelectTrigger className="w-[200px] outline-none border border-gray-300 dark:border-[#333] bg-white dark:bg-[#000]
//     text-black dark:text-white/75">
//         <SelectValue placeholder={placeholder} />
//       </SelectTrigger>

//       <SelectContent className="bg-white dark:bg-[#000] text-black dark:text-white border border-gray-300 dark:border-[#333]">
//         <SelectGroup>
//           {items.map((item) => (
//             <SelectItem
//               key={item.value}
//               value={item.value}
//               className="hover:bg-gray-100 dark:hover:bg-[#111]"
//             >
//               {item.label}
//             </SelectItem>
//           ))}
//         </SelectGroup>
//       </SelectContent>

//     </Select>
//   );
// }
