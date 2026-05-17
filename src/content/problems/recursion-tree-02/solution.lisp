(defun double-tree (tree)
  (cond
    ((null tree) nil)
    ((atom tree) (* tree 2))
    (t (cons (double-tree (first tree))
             (double-tree (rest tree))))))