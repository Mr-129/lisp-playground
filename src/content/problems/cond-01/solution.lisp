(defun check-sign (n)
  (if (plusp n) "positive" "non-positive"))
(print (check-sign 5))
(print (check-sign -3))