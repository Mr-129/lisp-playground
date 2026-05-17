(defun my-reverse (lst)
  (if (null lst)
      nil
      (append (my-reverse (cdr lst)) (list (car lst)))))
(print (my-reverse '(1 2 3 4 5)))
(print (my-reverse nil))