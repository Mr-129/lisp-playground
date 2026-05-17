(defun count-atoms (tree)
  (cond
    ((null tree) 0)
    ((atom tree) 1)
    (t (+ (count-atoms (first tree))
          (count-atoms (rest tree))))))