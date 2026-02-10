


git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/SonicSuper153/blog.git
git push -u origin main

git pull origin main --allow-unrelated-histories
git add .
git commit -m "merge remote"
git push -u origin main
