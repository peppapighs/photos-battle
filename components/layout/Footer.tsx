import changeTheme from 'lib/changeTheme'

export default function Footer() {
  const onThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const theme = e.target.value
    if (theme === 'system') {
      localStorage.removeItem('theme')
    } else {
      localStorage.setItem('theme', theme)
    }

    changeTheme()
  }

  return (
    <footer
      className="bg-white shadow dark:bg-gray-800"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-5xl py-8 px-4 sm:px-6 lg:py-12 lg:px-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
            <a
              className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              href="https://github.com/peppapighs/photos-battle"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">GitHub</span>
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-3">
              &copy; 2022 Pontakorn Prasertsuk. All rights reserved.
            </p>
          </div>
          <div className="mt-3 flex-shrink-0 sm:mt-0 sm:ml-3">
            <div>
              <label htmlFor="theme" className="sr-only">
                Theme
              </label>
              <select
                id="theme"
                name="theme"
                className="w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base text-gray-700 transition focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 sm:text-sm"
                defaultValue={localStorage.getItem('theme') || 'system'}
                onChange={onThemeChange}
              >
                <option value="system">System</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
