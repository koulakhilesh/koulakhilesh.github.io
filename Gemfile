source "https://rubygems.org"

# Local build pinned to the Jekyll version GitHub Pages uses (Ruby 2.6 compatible).
# The deployed site is built by GitHub Pages' own toolchain; we only rely on core
# features plus GitHub-Pages-whitelisted plugins, so local and remote stay consistent.
gem "jekyll", "~> 3.9.5"

# GitHub-Pages-whitelisted plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.15"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-sitemap", "~> 1.4"
end

# GFM markdown (fenced code blocks, tables)
gem "kramdown-parser-gfm", "~> 1.1"

# webrick for `jekyll serve`
gem "webrick", "~> 1.7"

# Pin native deps to versions compatible with system Ruby 2.6
gem "ffi", "~> 1.15.5"
