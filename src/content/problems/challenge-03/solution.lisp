(defun flatten (lst)
  (cond
    ((null lst) nil)
    ((consp lst) (append (flatten (car lst)) (flatten (cdr lst))))
    (t (list lst))))
(print (flatten '(1 (2 3) (4 (5 6)))))
(print (flatten '(1 2 3)))
(print (flatten nil))