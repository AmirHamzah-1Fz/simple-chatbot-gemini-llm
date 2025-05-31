import Layout from "../layout"

export default function ApiKey() {
  return (
    <Layout>
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-foreground/50 rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">API Key Settings</h1>
          <div className="space-y-6">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="apiKey"
                  className="block text-sm font-medium mb-2"
                >
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  id="apiKey"
                  className="w-full bg-background/50 rounded-lg p-3 border border-border focus:border-primary outline-none"
                  placeholder="Enter your OpenAI API key"
                />
                <p className="mt-2 text-sm text-body">
                  Your API key is stored securely and never shared.
                </p>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary text-background font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save API Key
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
