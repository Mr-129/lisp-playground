(defun apply-all (fns x)
  (mapcar (lambda (f) (funcall f x)) fns))
(print (apply-all (list #'1+ #'(lambda (x) (* x x)) #'abs) -3))