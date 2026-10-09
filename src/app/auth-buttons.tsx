import { handleSignIn, handleSignOut } from "./actions";

type AuthButtonsProps = {
  isLoggedIn: boolean;
  userName?: string | null;
};

export function AuthButtons({ isLoggedIn, userName }: AuthButtonsProps) {
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs text-stone-200 hidden sm:inline">
          สวัสดี {userName ?? "ผู้ใช้งาน"}
        </span>
        <form action={handleSignOut}>
          <button
            type="submit"
            className="rounded-lg bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-600"
          >
            Logout
          </button>
        </form>
      </div>
    );
  }

  return (
    <form action={handleSignIn}>
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
      >
        Login with Google
      </button>
    </form>
  );
}