# 🚀 SUCA Release Guide

This guide explains how to create releases for SUCA using our automated GitHub workflows.

## 📋 Table of Contents

- [Quick Release Process](#-quick-release-process)
- [Detailed Release Steps](#-detailed-release-steps)
- [Version Numbering](#-version-numbering)
- [Pre-Release Checklist](#-pre-release-checklist)
- [Workflow Overview](#-workflow-overview)
- [Troubleshooting](#-troubleshooting)

## ⚡ Quick Release Process

For experienced maintainers who want to create a release quickly:

```bash
# 1. Prepare release
git checkout main
git pull origin main

# 2. Update version in package.json
npm version patch|minor|major --no-git-tag-version

# 3. Commit and create tag
git add package.json
git commit -m "🔖 chore: bump version to v$(node -p "require('./package.json').version")"
git tag -a v$(node -p "require('./package.json').version") -m "Release v$(node -p "require('./package.json').version")"

# 4. Push with tags
git push origin main --follow-tags
```

**That's it!** 🎉 The GitHub workflow will automatically:
- Build for all platforms (Windows, macOS, Linux)
- Create release notes
- Upload artifacts to GitHub Releases

## 📝 Detailed Release Steps

### 1. 🔍 Pre-Release Preparation

#### Update Dependencies
```bash
npm audit fix
npm update
```

#### Run Tests
```bash
npm test
npm run build
```

#### Test Electron Build
```bash
npm run dist-portable  # Test Windows portable
npm run dist-win       # Test Windows installer
```

### 2. 📋 Version Management

#### Semantic Versioning
We follow [Semantic Versioning](https://semver.org/):

- **PATCH** (`v1.0.1`): Bug fixes, small improvements
- **MINOR** (`v1.1.0`): New features, backwards compatible
- **MAJOR** (`v2.0.0`): Breaking changes

#### Update Version
Choose the appropriate version bump:

```bash
# For bug fixes
npm version patch --no-git-tag-version

# For new features  
npm version minor --no-git-tag-version

# For breaking changes
npm version major --no-git-tag-version
```

### 3. 📝 Update Release Information

#### Update CHANGELOG.md (if exists)
```markdown
## [1.2.0] - 2024-01-15

### ✨ Added
- New IPv6 subnet calculator features
- Enhanced cryptography tools

### 🐛 Fixed
- Fixed UI lag in IPv4 calculator
- Resolved light mode icon visibility

### 🎨 Changed
- Improved tab organization
- Updated Material You design
```

#### Update Package Information
Ensure `package.json` has correct:
- Version number
- Description
- Author information
- Repository URL

### 4. 🏷️ Create Release Tag

#### Commit Version Changes
```bash
# Stage changes
git add package.json CHANGELOG.md

# Commit with semantic message
git commit -m "🔖 chore: bump version to v$(node -p "require('./package.json').version")"
```

#### Create Annotated Tag
```bash
# Create tag with version from package.json
git tag -a v$(node -p "require('./package.json').version") -m "Release v$(node -p "require('./package.json').version")"

# Or manually specify version
git tag -a v1.2.0 -m "Release v1.2.0"
```

#### Push to GitHub
```bash
# Push commits and tags
git push origin main --follow-tags
```

### 5. 🤖 Automated Build Process

Once you push the tag, GitHub Actions will automatically:

1. **🧪 Run Tests** - Ensure code quality
2. **🏗️ Build Matrix** - Create builds for:
   - 🪟 Windows (Installer + Portable + ZIP)
   - 🍎 macOS (DMG + ZIP)
   - 🐧 Linux (AppImage + DEB + TAR.GZ)
3. **📝 Generate Release Notes** - Auto-generated changelog
4. **🚀 Create GitHub Release** - With all artifacts attached

## 🔢 Version Numbering

### Current Versioning Scheme

```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
```

### Examples

- `v1.0.0` - Initial stable release
- `v1.1.0` - New features added
- `v1.1.1` - Bug fixes
- `v2.0.0` - Breaking changes
- `v1.2.0-beta.1` - Pre-release version
- `v1.2.0+20240115` - Build metadata

### When to Bump Versions

| Change Type | Example | Version Bump |
|-------------|---------|--------------|
| Bug fix | Fix calculation error | PATCH |
| New feature | Add new calculator | MINOR |
| UI improvement | New theme, better UX | MINOR |
| Breaking change | Remove old API | MAJOR |
| Security fix | Dependency update | PATCH |

## ✅ Pre-Release Checklist

### 🧪 Testing
- [ ] All unit tests pass
- [ ] Manual testing on primary platform
- [ ] UI tested in light/dark mode
- [ ] Responsive design verified
- [ ] Cross-platform compatibility checked

### 📚 Documentation
- [ ] README.md updated (if needed)
- [ ] CHANGELOG.md updated
- [ ] Version number bumped in package.json
- [ ] Release notes drafted

### 🔒 Security
- [ ] Dependencies audited (`npm audit`)
- [ ] No secrets in repository
- [ ] Code signed (if applicable)

### 🎯 Quality
- [ ] Code linted and formatted
- [ ] Performance verified
- [ ] Bundle size reasonable
- [ ] Memory usage acceptable

## 🔄 Workflow Overview

### Automatic Triggers

| Event | Trigger | Actions |
|-------|---------|---------|
| Push to `main` | Code changes | Tests, Build check |
| Create tag `v*` | Release | Full build, Release creation |
| Pull Request | Code review | Quality checks, Tests |

### Build Matrix

| Platform | Formats | Size | Notes |
|----------|---------|------|-------|
| Windows | `.exe`, `.zip` | ~100MB | Portable recommended |
| macOS | `.dmg`, `.zip` | ~120MB | Universal binary |
| Linux | `.AppImage`, `.deb`, `.tar.gz` | ~110MB | Multiple formats |

### Release Artifacts

The release will include:

```
📦 Release Assets:
├── 🪟 SUCA-Setup-1.2.0.exe          (Windows Installer)
├── 🪟 SUCA-Portable-1.2.0.exe       (Windows Portable) ⭐ Recommended
├── 🪟 SUCA-1.2.0-win.zip             (Windows Archive)
├── 🍎 SUCA-1.2.0.dmg                 (macOS Disk Image)
├── 🍎 SUCA-1.2.0-mac.zip             (macOS Archive)
├── 🐧 SUCA-1.2.0.AppImage            (Linux AppImage)
├── 🐧 SUCA-1.2.0.deb                 (Debian Package)
└── 🐧 SUCA-1.2.0.tar.gz              (Linux Archive)
```

## 🔧 Troubleshooting

### Common Issues

#### Build Failures

**Issue**: Electron build fails on specific platform
```bash
# Check build logs in GitHub Actions
# Test locally first:
npm run dist-win    # Test Windows build
npm run dist-mac    # Test macOS build  
npm run dist-linux  # Test Linux build
```

**Issue**: Missing dependencies
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### Tag Issues

**Issue**: Tag already exists
```bash
# Delete tag locally and remotely
git tag -d v1.2.0
git push origin :refs/tags/v1.2.0

# Create new tag
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0
```

**Issue**: Wrong version tagged
```bash
# Create patch version
npm version patch --no-git-tag-version
git add package.json
git commit -m "🔖 chore: bump to $(node -p "require('./package.json').version")"
git tag -a v$(node -p "require('./package.json').version") -m "Release v$(node -p "require('./package.json').version")"
git push origin main --follow-tags
```

### Release Validation

After release creation, verify:

1. **✅ All artifacts present** - Check all platform builds uploaded
2. **📝 Release notes accurate** - Review auto-generated content
3. **🔗 Download links work** - Test downloading and running
4. **📊 File sizes reasonable** - No unexpected size increases
5. **🎯 Version consistent** - Same version across all artifacts

### Emergency Fixes

If you need to fix a critical issue in a release:

```bash
# Create hotfix
git checkout v1.2.0
git checkout -b hotfix/v1.2.1

# Make minimal fix
# ... edit files ...

# Version bump
npm version patch --no-git-tag-version
git add .
git commit -m "🚨 hotfix: critical bug fix"

# Tag and release
git tag -a v1.2.1 -m "Hotfix v1.2.1"
git push origin hotfix/v1.2.1 --follow-tags

# Merge back to main
git checkout main
git merge hotfix/v1.2.1
git push origin main
```

## 📞 Support

### Getting Help

- 📚 **Documentation**: Check BUILD-INSTRUCTIONS.md
- 💬 **Discussions**: GitHub Discussions for questions
- 🐛 **Issues**: GitHub Issues for bugs
- 📧 **Contact**: maintainer@suca.app

### Best Practices

1. **🕐 Release Schedule**: Regular releases every 2-4 weeks
2. **🧪 Testing**: Always test before releasing
3. **📝 Communication**: Clear release notes
4. **🔒 Security**: Keep dependencies updated
5. **📊 Monitoring**: Watch for post-release issues

---

## 🎉 Congratulations!

You've successfully created a SUCA release! 🚀

The automated workflows will handle the heavy lifting, and users will be able to download the latest version from GitHub Releases.

**Remember**: Great releases come from great preparation. Take time to test thoroughly and communicate changes clearly.

---

*For more information, see our [Contributing Guidelines](CONTRIBUTING.md) and [Build Instructions](BUILD-INSTRUCTIONS.md).* 