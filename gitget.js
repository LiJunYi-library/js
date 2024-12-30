const getCurrentBranch = require('git-branch');

// 同步方式
try {
  const branchName = getCurrentBranch.sync();
  console.log('Current branch:', branchName);
} catch (error) {
  console.error('Error getting branch name:', error.message);
}
