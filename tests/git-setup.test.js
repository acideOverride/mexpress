const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Git Repository Setup', () => {
    const gitDir = '/opt/mExpress';
    
    test('Git repository is properly initialized', () => {
        expect(fs.existsSync(path.join(gitDir, '.git'))).toBe(true);
    });

    test('Main branch is set as default', () => {
        const currentBranch = execSync('git branch --show-current', { cwd: gitDir }).toString().trim();
        expect(currentBranch).toBe('main');
    });

    test('Branch protection is enabled for main', () => {
        const protection = execSync('git config branch.main.protection', { cwd: gitDir }).toString().trim();
        expect(protection).toBe('true');
    });

    test('Signed commits are required', () => {
        const requireSigned = execSync('git config branch.main.requireSignedCommits', { cwd: gitDir }).toString().trim();
        expect(requireSigned).toBe('true');
    });

    test('Commit message template is configured', () => {
        const template = execSync('git config commit.template', { cwd: gitDir }).toString().trim();
        expect(template).toBe('.gitmessage');
        expect(fs.existsSync(path.join(gitDir, '.gitmessage'))).toBe(true);
    });

    test('Pre-commit hook is executable', () => {
        const hookPath = path.join(gitDir, '.git', 'hooks', 'pre-commit');
        const stats = fs.statSync(hookPath);
        expect(stats.mode & fs.constants.S_IXUSR).toBeTruthy();
    });

    test('Git message template contains required sections', () => {
        const template = fs.readFileSync(path.join(gitDir, '.gitmessage'), 'utf8');
        expect(template).toContain('<type>');
        expect(template).toContain('<subject>');
        expect(template).toContain('<body>');
        expect(template).toContain('<footer>');
    });

    test('Documentation is complete', () => {
        const docPath = path.join(gitDir, 'docs', 'implementation', 'git-setup.md');
        const doc = fs.readFileSync(docPath, 'utf8');
        
        expect(doc).toContain('Repository Structure');
        expect(doc).toContain('Branch Protection Rules');
        expect(doc).toContain('Commit Message Template');
        expect(doc).toContain('Git Hooks');
        expect(doc).toContain('Quality Gates');
    });
});