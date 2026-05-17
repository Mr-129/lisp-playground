(defun sum-tree (tree)
  (cond
    ((null tree) 0)
    ((atom tree) tree)
    (t (+ (sum-tree (first tree))
          (sum-tree (rest tree))))))