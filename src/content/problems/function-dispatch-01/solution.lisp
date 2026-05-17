(defun choose-op (use-add)
  (if use-add #'+ #'*))
(print (funcall (choose-op t) 2 3 4))
(print (funcall (choose-op nil) 2 3 4))