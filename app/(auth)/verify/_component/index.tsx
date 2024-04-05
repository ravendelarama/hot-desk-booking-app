import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button";

function Verify() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-auto h-auto border border-gray-300 p-20 rounded-lg shadow-md flex flex-col items-center">
            <img className="h-auto w-32 pb-4 self-center mb-8" src="../src/assets/text-dark.png"></img>
            <h1 className="text-3xl font-semibold mb-10">Verify your email address</h1>
            <p className="text-medium font-semibold mb-4">Welcome to SpotDesk!</p>
            <p className="text-medium font-semibold mb-8">To start your desk reservation, please verify your email address by clicking the button below.</p>
            <Button className="w-200 h-10 text-sm bg-black"><Mail className="mr-2 h-4 w-4" />Verify Email Address</Button>
          </div>
        </div>
      );
}

export default Verify;