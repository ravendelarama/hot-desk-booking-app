import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

function Guidelines() {
  return (
    <div className="p-3 sm:pt-10 sm:pl-10 flex flex-col space-y-5">
      <h1 className="text-3xl font-bold font-sans">User Guidelines</h1>
      <p className="text-slate-500 text-sm text-bold break-normal font-bold">
        Welcome to the SpotDesk System. This guide is designed to help the users
        easily utilize the features of SpotDesk System.
      </p>
      <Separator />
      <div className="lg:p-10 space-y-6">
        <div className="w-full space-y-4">
          <p className="font-bold text-lg">1. Sign in Page</p>
          <p className="text-xs lg:text-sm lg:ml-4 text-slate-500 font-semibold">
            In the event of system access, users need to sign in using their
            email address and password. If the users prefer not to provide their
            email address and password, they have an available option to sign in
            by just using their Google account.
          </p>
          <div>
            <div className="w-full flex flex-col justify-center items-center space-y-2">
              <Image
                src="https://utfs.io/f/b35fa096-e493-479d-ae4f-d3ee1fb5bc0c-dbse92.jpg"
                alt="Image"
                width={300}
                height={500}
                className="rounded-md object-cover"
              />
              <p className="text-xs text-slate-500 italic text-center">
                Sign in page
              </p>
            </div>
          </div>
          <p className="text-xs lg:text-sm lg:ml-4 text-slate-500 font-semibold">
            On the other hand, if the user don&#39;t have an account yet, they
            must click the &quot;Sign up&quot; option for them to create an
            account.
          </p>
        </div>
        <div className="w-full space-y-4">
          <p className="font-bold text-lg">2. Sign up Page</p>
          <p className="text-xs lg:text-sm lg:ml-4 text-slate-500 font-semibold">
            Here in the sign up option the user will just need to fill out what
            requirements are needed. They can also use the option &quot;sign up
            with Google account&quot;.
          </p>
          <div>
            <div className="w-full flex flex-col justify-center items-center space-y-2">
              <Image
                src="https://utfs.io/f/568a09ef-7964-44e1-9fc0-034afcf13058-k7j9fz.png"
                alt="Image"
                width={300}
                height={600}
                className="rounded-md object-cover"
              />
              <p className="text-xs text-slate-500 italic text-center">
                Sign up page
              </p>
            </div>
          </div>
          <p className="text-xs lg:text-sm lg:ml-4 text-slate-500 font-semibold">
            After successfully logging in or signing up, users will be directed
            to the home page of the SpotDesk system.
          </p>
        </div>
        <div className="w-full space-y-4">
          <p className="font-bold text-lg">3. Overview of the Home page</p>
          <p className="text-xs lg:text-sm lg:ml-4 text-slate-500 font-semibold">
            From the home page, users can explore available features according
            to their preferences and requirements. Available features, including
            Booking, FAQ, and Reserve.
          </p>
          <p className="text-xs lg:text-sm lg:ml-4 text-slate-500 font-semibold">
            In &quot;Home page&quot; you will see the available details such as,
            total booking, total employees, total available desk, and so on
          </p>
          <div>
            <div className="w-full flex flex-col justify-center items-center space-y-2">
              <Image
                src="https://utfs.io/f/18253770-145d-4a42-85e0-6dbd1bbf85a9-1wrmn.png"
                alt="Image"
                width={600}
                height={300}
                className="rounded-md object-cover"
              />
              <p className="text-xs text-slate-500 italic text-center">
                Home page
              </p>
            </div>
          </div>
        </div>
        <div className="w-full space-y-4">
          <p className="font-bold text-lg">4. Booking part</p>
          <p className="text-xs lg:text-sm lg:ml-4 text-slate-500 font-semibold">
            After that, if the user wants to book a desk they just click the
            &quot; Reserve&quot; option and with that they can select an area or
            floor on the &quot;Desk Map&quot; that suits their preferences. And
            of course users need to select a date that they wanted in their
            bookings.
          </p>
          <div>
            <div className="w-full flex flex-col justify-center items-center space-y-2">
              <Image
                src="https://utfs.io/f/930dbdf2-e81f-4006-a7c2-3ea499ac1d97-66qvsw.png"
                alt="Image"
                width={600}
                height={300}
                className="rounded-md object-cover"
              />
              <p className="text-xs text-slate-500 italic text-center">
                Reserve Page
              </p>
            </div>
          </div>

          <p className="text-xs lg:text-sm lg:ml-4 text-slate-500 font-semibold">
            If the user click the &quot;show&quot; button they will be directed
            into the desk where they are placed or the location of their
            bookings. (The green circle or spot indicates that the desk is
            available while the red spot is not available.)
          </p>
          <p className="text-xs lg:text-sm lg:ml-4 text-slate-500 font-semibold">
            If the user click one of the green spots there will appear what desk
            or floor they have been selected. &quot;It says You have selected
            desk D4 on floor1&quot;. See the examples below.
          </p>
          <div>
            <div className="w-full flex flex-col justify-center items-center space-y-2">
              <Image
                src="https://utfs.io/f/6abd8520-5aab-46a0-a94c-c2b752406378-5ba2vi.png"
                alt="Image"
                width={600}
                height={300}
                className="rounded-md object-cover"
              />
              <p className="text-xs text-slate-500 italic text-center">
                Location of your booking
              </p>
            </div>
          </div>
          <div>
            <div className="w-full flex flex-col justify-center items-center space-y-2">
              <Image
                src="https://utfs.io/f/e1932bc1-3f37-402d-9beb-cd1fd7ac4e20-gp14ct.png"
                alt="Image"
                width={600}
                height={300}
                className="rounded-md object-cover"
              />
              <p className="text-xs text-slate-500 italic text-center">
                Booking indicator
              </p>
            </div>
          </div>
        </div>
        <div className="w-full space-y-4">
          <p className="font-bold text-lg">5. Details</p>
          <p className="text-xs lg:text-sm lg:ml-4 text-slate-500 font-semibold">
            This is the details of the users booking. If the user click the
            &quot;continue&quot; button, that means user&#39;s reservation has
            been created.
          </p>
          <div>
            <div className="w-full flex flex-col justify-center items-center space-y-2">
              <Image
                src="https://utfs.io/f/c685aad0-fcee-476e-9559-919953de29f1-jun26m.jpg"
                alt="Image"
                width={500}
                height={500}
                className="rounded-md object-cover"
              />
              <p className="text-xs text-slate-500 italic text-center">
                Booking Details
              </p>
            </div>
          </div>
        </div>
        <div className="w-full space-y-4">
          <p className="font-bold text-lg">6. Bookings Page</p>
          <p className="text-xs lg:text-sm lg:ml-4 text-slate-500 font-semibold">
            After the user&#39;s reservation has already been created, they just
            click the &quot;Booking&quot; option so that they will see their
            reservation.
          </p>
          <div>
            <div className="w-full flex flex-col justify-center items-center space-y-2">
              <Image
                src="https://utfs.io/f/c685aad0-fcee-476e-9559-919953de29f1-jun26m.jpg"
                alt="Image"
                width={500}
                height={500}
                className="rounded-md object-cover"
              />
              <p className="text-xs text-slate-500 italic text-center">
                Booking Details
              </p>
            </div>
          </div>
          <p className="text-xs lg:text-sm lg:ml-4 text-slate-500 font-semibold">
            While waiting for their reservation, users cannot click the
            &quot;green check&quot; button because it is only enabled on their
            reservation date. And if it is enabled they can also checked out on
            that date.
          </p>
          <div>
            <div className="w-full flex flex-col justify-center items-center space-y-2">
              <Image
                src="https://utfs.io/f/465f62c8-1eeb-4a41-9f1d-61949bed1104-fr603m.png"
                alt="Image"
                width={500}
                height={500}
                className="rounded-md object-cover"
              />
              <p className="text-xs text-slate-500 italic text-center">
                Booking check-in button
              </p>
            </div>
          </div>
          <p className="text-xs lg:text-sm lg:ml-4 text-slate-500 font-semibold">
            On the other hand, the &quot;red button&quot; is for cancellation of
            a user&#39;s reservation. So if the user click the red button their
            reservation will be canceled. See the examples below.
          </p>
          <div>
            <div className="w-full flex flex-col justify-center items-center space-y-2">
              <Image
                src="https://utfs.io/f/ef2ce273-9c0f-4635-8d41-1944e3585722-99nii6.png"
                alt="Image"
                width={500}
                height={500}
                className="rounded-md object-cover"
              />
              <p className="text-xs text-slate-500 italic text-center">
                Booking cancel button
              </p>
            </div>
          </div>
          <div>
            <div className="w-full flex flex-col justify-center items-center space-y-2">
              <Image
                src="https://utfs.io/f/2a6e8ec9-5827-4f18-9d2c-b6bd584cb6b2-h4lm92.png"
                alt="Image"
                width={500}
                height={500}
                className="rounded-md object-cover"
              />
              <p className="text-xs text-slate-500 italic text-center">
                Booking check-in button
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guidelines;
