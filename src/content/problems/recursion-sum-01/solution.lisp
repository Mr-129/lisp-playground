(defun sum-list (lst)
  (if (null lst)
      0
      (+ (car lst) (sum-list (cdr lst)))))
(print (sum-list '(1 2 3 4 5)))
(print (sum-list nil))