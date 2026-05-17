(defun my-sum (lst)
  (if (null lst)
      0
      (+ (car lst) (my-sum (cdr lst)))))
(print (my-sum '(1 2 3 4 5)))
(print (my-sum nil))