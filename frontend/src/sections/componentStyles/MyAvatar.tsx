import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import av1 from '../assets/av3.jpg';

export default function AvatarDemo() {
    return (
        <Avatar className="w-[13rem] h-[15rem]">
            < AvatarImage src={av1} />
            <AvatarFallback>S</AvatarFallback>
        </Avatar >
    )
}
